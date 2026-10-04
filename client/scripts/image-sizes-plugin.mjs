/**
 * Vite plugin: `virtual:image-sizes` exports the intrinsic size of every
 * product/device/brand image, read from the file header at build time, so the
 * prerendered HTML can lay out by aspect ratio without waiting for onLoad.
 *   import sizes from 'virtual:image-sizes';
 *   sizes['/src/assets/products/<slug>/primary.webp'] → [width, height]
 * Formats: WebP (VP8, VP8L, VP8X), PNG, JPEG. Anything else is left out.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ID = 'virtual:image-sizes';
const RESOLVED = '\0' + ID;
const DIRS = ['src/assets/products', 'src/assets/devices', 'src/assets/brand'];

export function readImageSize(buf) {
  // PNG
  if (buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  // WebP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
    if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8L') {
      const [b0, b1, b2, b3] = buf.subarray(21, 25);
      return [1 + (((b1 & 0x3f) << 8) | b0), 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))];
    }
    return null;
  }
  // JPEG: walk the markers to the first start-of-frame
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o + 9 < buf.length) {
      if (buf[o] !== 0xff) { o++; continue; }
      const m = buf[o + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [buf.readUInt16BE(o + 7), buf.readUInt16BE(o + 5)];
      o += 2 + buf.readUInt16BE(o + 2);
    }
  }
  return null;
}

function walk(dir, out = []) {
  let entries = [];
  try { entries = readdirSync(dir); } catch { return out; }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(webp|png|jpe?g)$/i.test(name)) out.push(p);
  }
  return out;
}

export default function imageSizes() {
  let root = process.cwd();
  return {
    name: 'image-sizes',
    configResolved(config) { root = config.root; },
    // Dev: when an image in the asset folders is added, changed or removed, rebuild the module and
    // reload. (Not this.addWatchFile: the dev server would treat the folders as imports.)
    configureServer(server) {
      const norm = (p) => p.split(sep).join('/').toLowerCase();
      const dirs = DIRS.map((d) => norm(join(root, d)) + '/');
      const onChange = (file) => {
        const f = norm(file);
        if (!/\.(webp|png|jpe?g)$/i.test(f) || !dirs.some((d) => f.startsWith(d))) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) { server.moduleGraph.invalidateModule(mod); server.ws.send({ type: 'full-reload' }); }
      };
      for (const event of ['add', 'change', 'unlink']) server.watcher.on(event, onChange);
    },
    resolveId(id) { return id === ID ? RESOLVED : null; },
    load(id) {
      if (id !== RESOLVED) return null;
      const sizes = {};
      for (const dir of DIRS) {
        const abs = join(root, dir);
        for (const file of walk(abs)) {
          const size = readImageSize(readFileSync(file));
          if (size) sizes['/' + relative(root, file).split(sep).join('/')] = size;
        }
      }
      return `export default ${JSON.stringify(sizes)};`;
    },
  };
}

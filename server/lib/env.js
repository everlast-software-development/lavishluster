/**
 * Loads the project-root .env (never committed; see .env.example) before any configuration is read.
 * Imported first by index.js. Variables already set in the environment (e.g. on the production host)
 * take precedence over the file.
 */
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const file = resolve(dirname(fileURLToPath(import.meta.url)), '../../.env');
if (existsSync(file) && typeof process.loadEnvFile === 'function') process.loadEnvFile(file);

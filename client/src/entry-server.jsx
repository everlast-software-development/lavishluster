import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { HeadProvider } from './components/ui/Seo.jsx';
import { renderHead } from './utils/seo.js';
import { getPrerenderPaths } from './routes/index.jsx';

export function render(url) {
  const head = { data: null };
  const html = renderToString(
    <HeadProvider value={head}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HeadProvider>,
  );
  return { html, head: renderHead(head.data), meta: head.data };
}

export { getPrerenderPaths };

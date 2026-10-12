import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import { routes } from './routes/index.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Preloader from './components/layout/Preloader.jsx';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          {routes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* Outside the routes: mounted once, so it shows on the initial load only, never on in-app navigation. */}
      <Preloader />
    </>
  );
}

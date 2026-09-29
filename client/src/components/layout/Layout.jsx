import { Outlet, useLocation } from 'react-router-dom';
import Header from '../navigation/Header.jsx';
import Footer from '../footer/Footer.jsx';
import ScrollManager from './ScrollManager.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <Header />
      <main id="main" key={pathname} className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/** Legal pages — behind features.legalPages; content must be supplied (data/content/legal.js). */
import Seo from '../../components/ui/Seo.jsx';
import PageHero from '../../components/ui/PageHero.jsx';
import { legal } from '../../data/content/legal.js';
import NotFound from '../NotFound/NotFound.jsx';

const TITLES = { privacy: 'Privacy Policy', terms: 'Terms & Conditions' };

export default function Legal({ kind }) {
  const body = legal[kind];
  if (!body) return <NotFound />;
  return (
    <>
      <Seo title={TITLES[kind]} path={`/${kind}`} />
      <PageHero title={TITLES[kind]} />
      <div className="container legal">
        {body.split(/\n{2,}/).map((para, i) => <p key={i} className="prose">{para}</p>)}
      </div>
    </>
  );
}

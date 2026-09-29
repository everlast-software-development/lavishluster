export default function PageHero({ title, kicker, intro, aside, children }) {
  return (
    <header className="page-hero">
      <div className="container page-hero__grid">
        <div className="page-hero__text">
          {kicker && <p className="kicker">{kicker}</p>}
          <h1 className="page-hero__title">{title}</h1>
          {intro && <p className="page-hero__intro">{intro}</p>}
          {children}
        </div>
        {aside && <div className="page-hero__aside">{aside}</div>}
      </div>
    </header>
  );
}

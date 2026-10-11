/**
 * Centurion LED & NIR light functions (Master): the intro, then the functions as a hairline list
 * (wavelength · name, the description below). Wavelength strings are shown exactly as written.
 * The NIR row is withheld pending verification (V-03).
 */
export default function LightFunctions({ data }) {
  return (
    <>
      <p className="pdp-text">{data.intro}</p>
      <ul className="pdp-functions">
        {data.items.map((it) => (
          <li key={it.name} className="pdp-functions__item">
            <span className="pdp-functions__wavelength">{it.wavelength}</span>
            <span className="pdp-functions__name">{it.name}</span>
            <span className="pdp-functions__desc">{it.description}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

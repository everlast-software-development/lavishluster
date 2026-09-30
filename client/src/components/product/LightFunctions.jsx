/**
 * Centurion LED & NIR light functions (Master), as a hairline table.
 * Wavelength strings are shown exactly as written.
 * The NIR row is withheld pending verification (V-03).
 */
export default function LightFunctions({ data }) {
  return (
    <div className="light">
      <p className="light__intro">{data.intro}</p>
      <ul className="light__list">
        {data.items.map((it) => (
          <li key={it.name}>
            <span className="light__wavelength">{it.wavelength}</span>
            <span className="light__name">{it.name}</span>
            <span className="light__desc">{it.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

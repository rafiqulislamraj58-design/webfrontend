export default function SectionTitle({
  eyebrow,
  title,
  accent,
  description,
  light = false,
}) {
  return (
    <div className={`section-head ${light ? "text-white" : ""}`}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2>
          {title}
          <br />
          <em>{accent}</em>
        </h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

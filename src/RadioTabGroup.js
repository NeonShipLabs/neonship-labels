import "./RadioTabGroup.css";

export default function RadioTabGroup({
  className,
  onChange,
  options,
  value,
  title,
}) {
  const change = (e) => onChange && onChange(e);

  return (
    <div className={`RadioTabGroup ${className}`} title={title}>
      {options.map((option) => (
        <label
          className={`option ${value === option ? "checked" : ""}`}
          key={option}
        >
          <input
            onChange={change}
            type="radio"
            name="drone"
            value={option}
            checked={value === option}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

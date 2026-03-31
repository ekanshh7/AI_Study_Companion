import "./SearchBar.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search by title…",
  id = "task-search",
}) {
  return (
    <div className="search-bar">
      <label className="search-bar__label visually-hidden" htmlFor={id}>
        Filter tasks by title
      </label>
      <input
        id={id}
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

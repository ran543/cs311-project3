import { useState } from "react";

export default function SearchBox({ onSearch, searching }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <label className="form-label" htmlFor="pokemon-search">
        Search by Pokémon name or ID
      </label>
      <div className="input-group">
        <input
          id="pokemon-search"
          className="form-control"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try pikachu or 25"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={searching || !query.trim()}
        >
          {searching ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
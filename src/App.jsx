import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PokemonCard from "./components/PokemonCard";
import SearchBox from "./components/SearchBox";

const API = "https://pokeapi.co/api/v2";

async function getData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.status === 404 ? "Pokémon not found." : "Request failed.");
  }
  return response.json();
}

async function loadList(fireOnly) {
  const data = await getData(
    fireOnly ? `${API}/type/fire` : `${API}/pokemon?limit=20`
  );

  // The type endpoint nests each Pokémon under a "pokemon" property.
  const entries = fireOnly
    ? data.pokemon.slice(0, 20).map((entry) => entry.pokemon)
    : data.results;

  return Promise.all(entries.map((entry) => getData(entry.url)));
}

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [fireOnly, setFireOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pokemon-favorites"));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setListError("");

    loadList(fireOnly)
      .then((items) => {
        if (active) setPokemon(items);
      })
      .catch(() => {
        if (active) setListError("Could not load Pokémon. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [fireOnly]);

  useEffect(() => {
    localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
  }, [favorites]);

  async function searchPokemon(query) {
    setSearching(true);
    setResult(null);
    setMessage("");
    try {
      const item = await getData(
        `${API}/pokemon/${encodeURIComponent(query.toLowerCase())}`
      );
      setResult(item);
    } catch (error) {
      setMessage(error.message === "Pokémon not found."
        ? error.message
        : "Could not complete the search. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function renderCard(item) {
    return (
      <PokemonCard
        key={item.id}
        pokemon={item}
        favorite={favorites.includes(item.id)}
        onFavorite={() => toggleFavorite(item.id)}
      />
    );
  }

  return (
    <main className="container py-4">
      <h1>Pokémon Explorer</h1>
      <p>Saved favorites: {favorites.length}</p>

      <SearchBox onSearch={searchPokemon} searching={searching} />
      {message && <p role="status">{message}</p>}
      {result && (
        <section className="mb-4">
          <h2>Search result</h2>
          <div className="pokemon-grid">{renderCard(result)}</div>
        </section>
      )}

      <section>
        <h2>{fireOnly ? "Fire-type Pokémon" : "First 20 Pokémon"}</h2>
        <button
          className="btn btn-outline-danger mb-3"
          onClick={() => setFireOnly(!fireOnly)}
        >
          {fireOnly ? "Show first 20" : "Show fire types"}
        </button>
        {loading ? <p>Loading Pokémon…</p> : listError ? (
          <p role="alert">{listError}</p>
        ) : (
          <div className="pokemon-grid">{pokemon.map(renderCard)}</div>
        )}
      </section>
    </main>
  );
}
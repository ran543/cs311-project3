export default function PokemonCard({ pokemon, favorite, onFavorite }) {
  return (
    <article className="card text-center p-3">
      {pokemon.sprites.front_default && (
        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      )}
      <p className="text-secondary mb-1">#{pokemon.id}</p>
      <h3 className="h5 text-capitalize">{pokemon.name}</h3>
      <p className="mb-1">
        Type: {pokemon.types.map((entry) => entry.type.name).join(", ")}
      </p>
      <p>Weight: {pokemon.weight / 10} kg</p>
      <button
        className="btn btn-outline-primary mt-auto"
        aria-pressed={favorite}
        onClick={onFavorite}
      >
        {favorite ? "Remove favorite" : "Add favorite"}
      </button>
    </article>
  );
}
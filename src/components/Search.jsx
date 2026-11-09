
import { useState } from "react";

function Search({ onSearch, loading }) {
  const [city, setCity] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (city.trim() === "") {
      return;
    }

    onSearch(city);
  }

  return (
    <form className="search" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite o nome de uma cidade..."
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Buscando..." : "Pesquisar"}
      </button>
    </form>
  );
}

export default Search;

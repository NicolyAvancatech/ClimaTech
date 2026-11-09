
import { useState, useEffect } from "react";

import Header from "../components/Header";
import Search from "../components/Search";
import WeatherCard from "../components/WeatherCard";
import WeatherDetails from "../components/WeatherDetails";

// Identifica o clima através do código da API
function getWeatherInfo(code, isDay) {
  if (code === 0) {
    return {
      description: "Céu limpo",
      icon: isDay ? "☀️" : "🌙"
    };
  }

  if ([1, 2].includes(code)) {
    return {
      description: "Parcialmente nublado",
      icon: "🌤️"
    };
  }

  if (code === 3) {
    return {
      description: "Nublado",
      icon: "☁️"
    };
  }

  if ([45, 48].includes(code)) {
    return {
      description: "Neblina",
      icon: "🌫️"
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      description: "Garoa",
      icon: "🌦️"
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      description: "Chuva",
      icon: "🌧️"
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      description: "Neve",
      icon: "❄️"
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      description: "Tempestade",
      icon: "⛈️"
    };
  }

  return {
    description: "Condição variável",
    icon: "🌥️"
  };
}

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchCity(city) {
    try {
      setLoading(true);
      setError("");

      setWeather(null);

      // 1. Buscar a cidade
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=pt&format=json`
      );

      if (!locationResponse.ok) {
        throw new Error("Erro ao buscar a cidade.");
      }

      const locationData = await locationResponse.json();

      // 2. Verificar se encontrou uma cidade
      if (!locationData.results) {
        throw new Error("Cidade não encontrada.");
      }

      // 3. Procurar somente cidades do Brasil
      const selectedCity = locationData.results.find(
        (item) => item.country_code === "BR"
      );

      if (!selectedCity) {
        throw new Error(
          "Não encontramos essa cidade no Brasil."
        );
      }

      // 4. Buscar o clima através das coordenadas
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Erro ao consultar a previsão.");
      }

      const weatherData = await weatherResponse.json();

      // 5. Organizar as informações
      const current = weatherData.current;
      const daily = weatherData.daily;

      const weatherInfo = getWeatherInfo(
        current.weather_code,
        current.is_day
      );

      setWeather({
        city: selectedCity.name,
        state: selectedCity.admin1 || "Brasil",
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        feelsLike: current.apparent_temperature,
        wind: current.wind_speed_10m,
        max: daily.temperature_2m_max[0],
        min: daily.temperature_2m_min[0],
        description: weatherInfo.description,
        icon: weatherInfo.icon
      });

    } catch (error) {
      setError(
        error.message || "Não foi possível consultar o clima."
      );
    } finally {
      setLoading(false);
    }
  }

  // Carregar São Paulo ao abrir o site
  useEffect(() => {
    searchCity("São Paulo");
  }, []);

  return (
    <main className="container">
      <Header />

      <section className="intro">
        <h2>Como está o tempo hoje?</h2>
        <p>
          Descubra a previsão do tempo em qualquer
          cidade do Brasil.
        </p>
      </section>

      <Search
        onSearch={searchCity}
        loading={loading}
      />

      {loading && (
        <p className="message">
          Consultando previsão do tempo...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {weather && !loading && (
        <>
          <WeatherCard weather={weather} />

          <WeatherDetails weather={weather} />
        </>
      )}

      <footer>
        <p>
          © 2026 Clima Tech | Dados meteorológicos
          fornecidos pela Open-Meteo.
        </p>
      </footer>
    </main>
  );
}

export default Home;

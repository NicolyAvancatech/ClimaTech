const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";

// Busca as coordenadas da cidade
export async function fetchWeather(city) {

  const geoParams = new URLSearchParams({
    name: city,
    count: "1",
    language: "pt",
    format: "json",
  });

  const geoResponse = await fetch(
    `${GEOCODING_URL}?${geoParams}`
  );

  if (!geoResponse.ok) {
    throw new Error("Erro ao pesquisar cidade.");
  }

  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada.");
  }

  const place = geoData.results[0];

  // Busca o clima usando latitude e longitude
  const weatherParams = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
    timezone: "auto",
  });

  const weatherResponse = await fetch(
    `${WEATHER_URL}?${weatherParams}`
  );

  if (!weatherResponse.ok) {
    throw new Error("Erro ao buscar previsão.");
  }

  const weatherData = await weatherResponse.json();

  return {
    city: place.name,
    region: [place.admin1, place.country]
      .filter(Boolean)
      .join(", "),
    current: weatherData.current,
  };
}

// Transforma os códigos da API em ícones e descrições
export function getWeatherInfo(code, isDay = 1) {

  if (code === 0) {
    return {
      label: "Céu limpo",
      icon: isDay ? "☀️" : "🌙",
    };
  }

  if (code === 1 || code === 2) {
    return {
      label: "Parcialmente nublado",
      icon: "🌤️",
    };
  }

  if (code === 3) {
    return {
      label: "Nublado",
      icon: "☁️",
    };
  }

  if ([45, 48].includes(code)) {
    return {
      label: "Neblina",
      icon: "🌫️",
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      label: "Garoa",
      icon: "🌦️",
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      label: "Chuva",
      icon: "🌧️",
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: "Neve",
      icon: "❄️",
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      label: "Tempestade",
      icon: "⛈️",
    };
  }

  return {
    label: "Condição variável",
    icon: "🌡️",
  };
}


function WeatherCard({ weather }) {
  if (!weather) return null;

  return (
    <section className="weather-card">
      <div className="weather-location">
        <h2>
          {weather.city}
        </h2>

        <p>{weather.state}, Brasil</p>
      </div>

      <div className="weather-main">
        <span className="weather-icon">
          {weather.icon}
        </span>

        <div>
          <h1>{Math.round(weather.temperature)}°C</h1>
          <p>{weather.description}</p>
        </div>
      </div>

      <div className="temperature-range">
        <span>
          ↑ Máxima: {Math.round(weather.max)}°C
        </span>

        <span>
          ↓ Mínima: {Math.round(weather.min)}°C
        </span>
      </div>
    </section>
  );
}

export default WeatherCard;

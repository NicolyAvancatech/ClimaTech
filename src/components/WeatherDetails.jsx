
function WeatherDetails({ weather }) {
  if (!weather) return null;

  return (
    <section className="details">
      <h2>Detalhes do clima</h2>

      <div className="details-grid">
        <div className="detail-card">
          <span>💧</span>
          <h3>Umidade</h3>
          <p>{weather.humidity}%</p>
        </div>

        <div className="detail-card">
          <span>💨</span>
          <h3>Velocidade do vento</h3>
          <p>{weather.wind} km/h</p>
        </div>

        <div className="detail-card">
          <span>🌡️</span>
          <h3>Sensação térmica</h3>
          <p>{Math.round(weather.feelsLike)}°C</p>
        </div>
      </div>
    </section>
  );
}

export default WeatherDetails;

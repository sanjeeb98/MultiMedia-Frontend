function StatCard({ label, value, icon, accent = 'primary', subtext = null }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__content">
        <span className="stat-card__label">{label}</span>
        <span className="stat-card__value">{value}</span>
        {subtext && <span className="stat-card__subtext">{subtext}</span>}
      </div>
      {icon && <div className="stat-card__icon">{icon}</div>}
    </div>
  );
}

export default StatCard;

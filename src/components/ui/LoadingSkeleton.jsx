function LoadingSkeleton({ count = 6, variant = 'card' }) {
  if (variant === 'table') {
    return (
      <div className="skeleton-table">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton--row" />
        ))}
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="skeleton-stats">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton skeleton--stat" />
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;

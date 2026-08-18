function Input({
  label,
  error,
  hint,
  id,
  className = '',
  rightElement = null,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
        <input
          id={inputId}
          className={error ? 'input--error' : ''}
          {...props}
        />
        {rightElement}
      </div>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
}

export default Input;

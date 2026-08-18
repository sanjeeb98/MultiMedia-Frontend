function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon = null,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${className}`.trim()}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <span className="spinner" aria-hidden="true" />
      ) : (
        icon && <span className="btn__icon">{icon}</span>
      )}
      {children}
    </button>
  );
}

export default Button;

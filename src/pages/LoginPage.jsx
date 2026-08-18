import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import Button from '../components/ui/Button';
import { IconEye, IconEyeOff, IconWarning } from '../components/ui/Icons';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    if (!form.email || !form.password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-card__brand">
          <div className="brand-icon">M</div>
          <div className="brand-title">
            Media<span>Vault</span>
          </div>
        </Link>

        <div className="auth-card__header">
          <h1>Sign in to your account</h1>
          <p>Access your indexed multimedia files and search engine</p>
        </div>

        {(error || validationError) && (
          <div className="alert alert--error">
            <IconWarning size={18} />
            <div>{error || validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div className="auth-card__footer">
          Don't have an account? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

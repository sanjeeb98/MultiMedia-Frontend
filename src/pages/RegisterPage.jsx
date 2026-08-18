import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import Button from '../components/ui/Button';
import { IconEye, IconEyeOff, IconWarning } from '../components/ui/Icons';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    if (form.username.trim().length < 3) {
      setValidationError('Username must be at least 3 characters long.');
      return;
    }
    if (form.password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const { confirmPassword, ...credentials } = form;
    const result = await dispatch(register(credentials));
    if (register.fulfilled.match(result)) {
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
          <h1>Create an account</h1>
          <p>Get started uploading and searching multimedia files</p>
        </div>

        {(error || validationError) && (
          <div className="alert alert--error">
            <IconWarning size={18} />
            <div>{error || validationError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="e.g. alex_designer"
              required
              minLength={3}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="name@company.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                id="reg-confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                required
                minLength={6}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                autoComplete="new-password"
              />
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

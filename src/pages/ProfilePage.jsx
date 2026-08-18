import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateUserProfile } from '../store/authSlice';
import { showToast } from '../store/uiSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconFiles,
} from '../components/ui/Icons';
import { getInitials, formatDate, formatFileSize } from '../utils/formatters';

function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myFiles } = useSelector((state) => state.files);

  // Edit profile state
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const initials = getInitials(user?.username || 'User');
  const totalFiles = myFiles.length;
  const totalViews = myFiles.reduce((acc, f) => acc + (f.viewCount || 0), 0);
  const totalStorage = myFiles.reduce((acc, f) => acc + (f.size || 0), 0);

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      dispatch(showToast({ message: 'Username must be at least 3 characters.', type: 'error' }));
      return;
    }
    setProfileSaving(true);
    setTimeout(() => {
      dispatch(updateUserProfile({ username: username.trim() }));
      setProfileSaving(false);
      setEditing(false);
      dispatch(showToast({ message: 'Profile updated successfully!', type: 'success' }));
    }, 400);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    setTimeout(() => {
      setPasswordSaving(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      dispatch(showToast({ message: 'Password changed successfully for this session.', type: 'success' }));
    }, 600);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <section className="profile-page__header">
        <div className="profile-avatar-large">{initials}</div>

        <div className="profile-info">
          <h1>{user?.username || 'User Profile'}</h1>
          <p className="profile-email">{user?.email || 'user@example.com'}</p>

          <div className="profile-meta-badges">
            <Badge variant="success">Account Active</Badge>
            <Badge variant="default">Verified Member</Badge>
            {user?.createdAt && (
              <Badge variant="default">
                Joined {formatDate(user.createdAt)}
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          icon={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </section>

      {/* Profile Grid */}
      <div className="profile-page__grid">
        {/* Account Details & Edit */}
        <div className="profile-page__card">
          <div className="card-header">
            <div className="card-icon">
              <IconUser size={18} />
            </div>
            <h3>Personal Information</h3>
          </div>

          {!editing ? (
            <dl className="meta-list">
              <div className="meta-item">
                <dt>Username</dt>
                <dd>{user?.username || '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Email Address</dt>
                <dd>{user?.email || '—'}</dd>
              </div>
              <div className="meta-item">
                <dt>Account Status</dt>
                <dd>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Active</span>
                </dd>
              </div>
              <div className="meta-item">
                <dt>Indexed Media Files</dt>
                <dd>{totalFiles} files</dd>
              </div>
              <div className="meta-item">
                <dt>Total Media Views</dt>
                <dd>{totalViews} views</dd>
              </div>
              <div className="meta-item">
                <dt>Approx. Storage Used</dt>
                <dd>{formatFileSize(totalStorage)}</dd>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setUsername(user?.username || '');
                    setEditing(true);
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleProfileSave}>
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                hint="Minimum 3 characters"
              />

              <Input
                label="Email Address"
                type="email"
                value={user?.email || ''}
                disabled
                hint="Email cannot be changed directly"
              />

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => setEditing(false)}
                  disabled={profileSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  type="submit"
                  loading={profileSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Security & Password */}
        <div className="profile-page__card" id="security">
          <div className="card-header">
            <div className="card-icon">
              <IconSettings size={18} />
            </div>
            <h3>Security & Authentication</h3>
          </div>

          {passwordError && (
            <div className="alert alert--error" style={{ marginBottom: '1rem' }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <div className="password-input-wrapper">
                <input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  required
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
              <label htmlFor="new-password">New Password</label>
              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              type="submit"
              loading={passwordSaving}
              style={{ marginTop: '0.5rem' }}
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

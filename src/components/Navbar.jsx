import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          Media<span>Search</span>
        </Link>
        {user && (
          <div className="navbar__user">
            <span>{user.username}</span>
            <button type="button" className="btn btn--ghost" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

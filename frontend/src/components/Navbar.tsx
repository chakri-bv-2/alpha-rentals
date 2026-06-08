import { FormEvent, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { CarIcon, SearchIcon } from './icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/cars${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-brand-600'}`;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <CarIcon width={18} height={18} />
          </span>
          Alpha<span className="text-brand-600">Rentals</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/cars" className={linkClass}>
            Cars
          </NavLink>
          {user && (
            <>
              <NavLink to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/bookings" className={linkClass}>
                My Bookings
              </NavLink>
            </>
          )}
        </div>

        <form onSubmit={submitSearch} className="hidden flex-1 justify-center lg:flex">
          <div className="relative w-72">
            <SearchIcon className="pointer-events-none absolute left-3 top-2.5 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search cars"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <button onClick={handleLogout} className="btn-primary">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

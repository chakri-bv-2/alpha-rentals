import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { CarIcon } from '../../components/icons';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '▦' },
  { to: '/admin/add-car', label: 'Add car', icon: '＋' },
  { to: '/admin/cars', label: 'Manage Cars', icon: '🚗' },
  { to: '/admin/bookings', label: 'Manage Bookings', icon: '📋' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <CarIcon width={16} height={16} />
          </span>
          Alpha<span className="text-brand-600">Rentals</span>
        </Link>
        <span className="text-sm text-gray-500">Welcome, {user?.fullName}</span>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="min-h-[calc(100vh-57px)] w-64 shrink-0 border-r border-gray-200 bg-white px-4 py-6">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <p className="mt-3 font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-gray-100" />
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <span className="w-5 text-center">🏠</span> Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <span className="w-5 text-center">⎋</span> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

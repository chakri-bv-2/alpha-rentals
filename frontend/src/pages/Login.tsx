import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { apiErrorMessage } from '../api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/';

  const [email, setEmail] = useState('user@alpharentals.in');
  const [password, setPassword] = useState('user123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const doLogin = async (em: string, pw: string) => {
    setError('');
    setLoading(true);
    try {
      await login(em, pw);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    doLogin(em, pw);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-6">
        <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
        <p className="mb-4 text-sm text-gray-500">Log in to book your ride.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          New here?{' '}
          <Link to="/register" className="text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
        <div className="mt-5 rounded-xl bg-gray-50 p-3">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
            Quick demo login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin('user@alpharentals.in', 'user123')}
              className="btn-outline text-xs"
            >
              👤 Customer
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => quickLogin('admin@alpharentals.in', 'admin123')}
              className="btn-outline text-xs"
            >
              🛡️ Admin
            </button>
          </div>
          <div className="mt-2 space-y-0.5 text-center text-[11px] text-gray-500">
            <p>Customer — user@alpharentals.in / user123</p>
            <p>Admin — admin@alpharentals.in / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';

const Login = () => {
  const { login, user, authLoading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/';

  if (!authLoading && user) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const data = await login(form.email, form.password);
      if (data?.success) {
        navigate(redirectTo, { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24">
      <BlurCircle top="10%" left="-5%" />
      <BlurCircle bottom="5%" right="-5%" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-surface-2/80 p-8 shadow-2xl backdrop-blur-xl">
        <Link to="/" className="mb-8 inline-block">
          <img src={assets.logo} alt="QuickShow" className="h-9 w-auto" />
        </Link>

        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Log in</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in to book tickets and manage your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-200">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 outline-none transition focus:border-primary/50"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-200">Password</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 outline-none transition focus:border-primary/50"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold transition hover:bg-primary-dull disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';

const Signup = () => {
  const { register, user, authLoading } = useAppContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const data = await register(form.name, form.email, form.password);
      if (data?.success) {
        navigate('/', { replace: true });
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
          Join QuickShow
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign up</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Create an account to book seats and save favorites.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span className="font-medium text-zinc-200">Full name</span>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 outline-none transition focus:border-primary/50"
              placeholder="Your name"
            />
          </label>

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
              minLength={6}
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="rounded-xl border border-white/10 bg-surface px-3.5 py-2.5 outline-none transition focus:border-primary/50"
              placeholder="At least 6 characters"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-full bg-primary py-3 text-sm font-semibold transition hover:bg-primary-dull disabled:opacity-60"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

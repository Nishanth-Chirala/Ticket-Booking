import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminNavbar = () => {
  return (
    <div className="flex h-16 items-center justify-between border-b border-white/10 bg-surface/80 px-6 backdrop-blur-md md:px-10">
      <Link to="/">
        <img src={assets.logo} alt="QuickShow" className="h-auto w-32 md:w-36" />
      </Link>
      <Link
        to="/"
        className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-primary/40 hover:text-white"
      >
        View Site
      </Link>
    </div>
  );
};

export default AdminNavbar;

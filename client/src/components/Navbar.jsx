import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  LogOut,
  MenuIcon,
  SearchIcon,
  ShieldCheck,
  TicketPlus,
  XIcon,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const navigate = useNavigate();
  const {
    favoriteMovies,
    user,
    logout,
    isAdmin,
    isOwner,
    adminRequest,
    requestAdminAccess,
  } = useAppContext();

  const closeMenu = () => {
    scrollTo(0, 0);
    setIsOpen(false);
  };

  const linkClass =
    'text-sm font-medium text-zinc-300 transition hover:text-white';

  const handleRequestAdmin = async () => {
    setRequesting(true);
    await requestAdminAccess();
    setRequesting(false);
    setMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <div className="mx-auto flex w-full items-center justify-between px-6 py-4 md:px-16 lg:px-36">
        <Link to="/" className="max-md:flex-1" onClick={closeMenu}>
          <img src={assets.logo} className="h-auto w-32 md:w-36" alt="QuickShow" />
        </Link>

        <nav
          className={`z-50 flex items-center gap-8 overflow-hidden backdrop-blur-xl transition-[width] duration-300 max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen max-md:flex-col max-md:justify-center max-md:bg-black/95 max-md:text-lg md:rounded-full md:border md:border-white/10 md:bg-white/5 md:px-8 md:py-2.5 ${
            isOpen ? 'max-md:w-full' : 'max-md:w-0'
          }`}
        >
          <XIcon
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 size-6 cursor-pointer md:hidden"
          />

          <Link onClick={closeMenu} to="/" className={linkClass}>
            Home
          </Link>
          <Link onClick={closeMenu} to="/movies" className={linkClass}>
            Movies
          </Link>
          <Link onClick={closeMenu} to="/" className={linkClass}>
            Theaters
          </Link>
          <Link onClick={closeMenu} to="/" className={linkClass}>
            Releases
          </Link>
          {favoriteMovies.length > 0 && (
            <Link onClick={closeMenu} to="/favorite" className={linkClass}>
              Favorites
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <SearchIcon className="hidden size-5 cursor-pointer text-zinc-300 transition hover:text-white md:block" />
          {!user ? (
            <Link
              to="/login"
              className="cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-semibold transition hover:bg-primary-dull sm:px-6"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold uppercase"
                aria-label="Account menu"
              >
                {user.name?.charAt(0) || 'U'}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-white/10 bg-surface-2 shadow-xl">
                  <div className="border-b border-white/10 px-4 py-3">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="mt-0.5 text-xs capitalize text-zinc-500">
                      {user.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/my-bookings');
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/5"
                  >
                    <TicketPlus className="size-4" />
                    My Bookings
                  </button>

                  {user.role === 'user' && (
                    <button
                      type="button"
                      disabled={
                        requesting || adminRequest?.status === 'pending'
                      }
                      onClick={handleRequestAdmin}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/5 disabled:opacity-50"
                    >
                      <ShieldCheck className="size-4" />
                      {adminRequest?.status === 'pending'
                        ? 'Request Pending'
                        : 'Request Admin Access'}
                    </button>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/admin');
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-white/5"
                    >
                      {isOwner ? 'Owner Panel' : 'Admin'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-400 transition hover:bg-white/5"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <MenuIcon
            onClick={() => setIsOpen(true)}
            className="size-7 cursor-pointer md:hidden"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

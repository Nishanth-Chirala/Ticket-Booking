import { useEffect, useState } from 'react';
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import timeFormat from '../lib/timeFormat';

const HeroSection = () => {
  const navigate = useNavigate();
  const { shows, image_base_url } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredMovies = shows.slice(0, 5);
  const movie = featuredMovies[activeIndex] || null;

  useEffect(() => {
    if (featuredMovies.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  useEffect(() => {
    if (activeIndex >= featuredMovies.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredMovies.length]);

  const bannerUrl = movie?.backdrop_path
    ? movie.backdrop_path.startsWith('http')
      ? movie.backdrop_path
      : image_base_url + movie.backdrop_path
    : '/backgroundImage.png';

  const genres =
    movie?.genres
      ?.slice(0, 3)
      .map((genre) => genre.name || genre)
      .join(' · ') || 'Now Showing';

  const year = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <section className="relative flex min-h-screen flex-col items-start justify-center overflow-hidden px-6 md:px-16 lg:px-36">
      <div
        key={bannerUrl}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: `url('${bannerUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/40" />

      <div className="relative z-10 flex max-w-2xl flex-col items-start gap-5 pt-24 md:gap-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Featured
        </p>

        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
          {movie?.title || 'Discover Movies'}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300 md:text-base">
          <span className="font-medium text-zinc-200">{genres}</span>
          {year && (
            <>
              <span className="hidden h-1 w-1 rounded-full bg-zinc-500 sm:inline-block" />
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="size-4 text-primary" />
                {year}
              </span>
            </>
          )}
          {movie?.runtime > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-4 text-primary" />
              {timeFormat(movie.runtime)}
            </span>
          )}
        </div>

        <p className="max-w-lg text-sm leading-relaxed text-zinc-300 md:text-base line-clamp-3">
          {movie?.overview ||
            'Browse the latest releases, pick your seats, and enjoy the show.'}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              if (movie?._id) {
                navigate(`/movies/${movie._id}`);
                scrollTo(0, 0);
              } else {
                navigate('/movies');
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold shadow-lg shadow-primary/25 transition hover:bg-primary-dull active:scale-[0.98]"
          >
            {movie ? 'Book Tickets' : 'Explore Movies'}
            <ArrowRight className="size-4" />
          </button>

          {movie && (
            <button
              onClick={() => {
                navigate('/movies');
                scrollTo(0, 0);
              }}
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              All Movies
            </button>
          )}
        </div>

        {featuredMovies.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            {featuredMovies.map((item, index) => (
              <button
                key={item._id}
                type="button"
                aria-label={`Show ${item.title}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-8 bg-primary'
                    : 'w-2.5 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

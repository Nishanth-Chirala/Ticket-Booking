import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import { useAppContext } from '../context/AppContext';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const posterUrl = movie.backdrop_path?.startsWith('http')
    ? movie.backdrop_path
    : image_base_url + movie.backdrop_path;

  const openMovie = () => {
    navigate(`/movies/${movie._id}`);
    scrollTo(0, 0);
  };

  const genres =
    movie.genres
      ?.slice(0, 2)
      .map((genre) => genre.name || genre)
      .join(' · ') || '';

  return (
    <article className="group flex w-full max-w-66 flex-col overflow-hidden rounded-2xl border border-white/5 bg-surface-2 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-52 w-full cursor-pointer object-cover object-right-bottom transition duration-500 group-hover:scale-105"
          onClick={openMovie}
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-2 to-transparent" />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
          <StarIcon className="size-3.5 fill-primary text-primary" />
          {Number(movie.vote_average || 0).toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="truncate text-base font-semibold text-white">{movie.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
          {new Date(movie.release_date).getFullYear()}
          {genres ? ` · ${genres}` : ''}
          {movie.runtime ? ` · ${timeFormat(movie.runtime)}` : ''}
        </p>

        <button
          className="mt-4 w-full cursor-pointer rounded-full bg-primary px-4 py-2.5 text-xs font-semibold transition hover:bg-primary-dull active:scale-[0.98]"
          onClick={openMovie}
        >
          Buy Tickets
        </button>
      </div>
    </article>
  );
};

export default MovieCard;

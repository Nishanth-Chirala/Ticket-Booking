import MovieCard from '../components/MovieCard';
import BlurCircle from '../components/BlurCircle';
import { useAppContext } from '../context/AppContext';

const Movies = () => {
  const { shows } = useAppContext();

  return shows.length > 0 ? (
    <div className="relative min-h-[80vh] overflow-hidden px-6 pt-28 pb-24 md:px-16 md:pt-36 lg:px-40 xl:px-44">
      <BlurCircle top="120px" left="0px" />
      <BlurCircle bottom="40px" right="40px" />

      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Browse
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Now Showing</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {shows.length} movie{shows.length === 1 ? '' : 's'} available
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shows.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        Catalogue
      </p>
      <h1 className="mt-3 text-3xl font-semibold">No Movies Available</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-400">
        Check back soon — new shows are added regularly.
      </p>
    </div>
  );
};

export default Movies;

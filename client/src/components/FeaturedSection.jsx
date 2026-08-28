import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import MovieCard from './MovieCard';
import { useAppContext } from '../context/AppContext';

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { shows } = useAppContext();

  return (
    <section className="overflow-hidden px-6 py-16 md:px-16 md:py-24 lg:px-24 xl:px-44">
      <div className="relative flex items-end justify-between gap-4 pb-10">
        <BlurCircle top="-40px" right="-80px" />
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Now Playing
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Featured Movies
          </h2>
        </div>
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-white"
        >
          View All
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shows.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          className="cursor-pointer rounded-full bg-primary px-10 py-3 text-sm font-semibold transition hover:bg-primary-dull active:scale-[0.98]"
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
        >
          Show More
        </button>
      </div>
    </section>
  );
};

export default FeaturedSection;

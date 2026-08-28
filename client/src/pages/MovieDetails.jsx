import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeFormat from '../lib/timeFormat';
import DateSelect from '../components/DateSelect';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const navigate = useNavigate();

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);

      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) {
        return toast.error('Please Login to proceed');
      }

      const { data } = await axios.post(
        '/api/user/update-favorites',
        {
          movieId: id,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  const isFavorite = favoriteMovies.find((movie) => movie._id === id);

  return show ? (
    <div className="px-6 pt-28 pb-16 md:px-16 md:pt-36 lg:px-40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:gap-12">
        <img
          src={
            show.movie.poster_path?.startsWith('http')
              ? show.movie.poster_path
              : image_base_url + show.movie.poster_path
          }
          alt={show.movie.title}
          className="mx-auto h-104 max-w-70 rounded-2xl object-cover shadow-2xl shadow-black/50 md:mx-0"
        />

        <div className="relative flex flex-col gap-4">
          <BlurCircle top="-100px" left="-100px" />
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            English
          </p>
          <h1 className="max-w-xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            {show.movie.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-zinc-300">
            <StarIcon className="size-5 fill-primary text-primary" />
            {Number(show.movie.vote_average || 0).toFixed(1)} User Ratings
          </div>

          <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">
            {show.movie.overview}
          </p>

          <p className="text-sm text-zinc-300">
            {timeFormat(show.movie.runtime)}
            <span className="mx-2 text-zinc-600">·</span>
            {(show.movie.genres || [])
              .map((genre) => genre.name || genre)
              .join(', ')}
            <span className="mx-2 text-zinc-600">·</span>
            {show.movie.release_date.split('-')[0]}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-surface-2 px-6 py-3 text-sm font-medium transition hover:bg-white/5 active:scale-[0.98]">
              <PlayCircleIcon className="size-5" />
              Watch Trailer
            </button>
            <a
              href="#dateSelect"
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold transition hover:bg-primary-dull active:scale-[0.98]"
            >
              Buy Tickets
            </a>
            <button
              onClick={handleFavorite}
              className="cursor-pointer rounded-full border border-white/10 bg-surface-2 p-3 transition hover:bg-white/5 active:scale-[0.98]"
              aria-label="Toggle favorite"
            >
              <Heart
                className={`size-5 ${
                  isFavorite ? 'fill-primary text-primary' : 'text-zinc-300'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-xl font-semibold">Cast</h2>
        <div className="no-scrollbar mt-6 overflow-x-auto pb-4">
          <div className="flex w-max items-start gap-5 px-1">
            {(show.movie.casts || []).slice(0, 12).map((cast, index) => (
              <div key={index} className="flex w-20 flex-col items-center text-center">
                <img
                  src={
                    cast.profile_path?.startsWith('http')
                      ? cast.profile_path
                      : image_base_url + cast.profile_path
                  }
                  alt={cast.name}
                  className="aspect-square size-16 rounded-full object-cover ring-2 ring-white/10 md:size-20"
                />
                <p className="mt-3 text-xs font-medium text-zinc-200">{cast.name}</p>
                {cast.character_name && (
                  <p className="mt-0.5 text-[11px] text-zinc-500">{cast.character_name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <div className="mt-20 mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            More
          </p>
          <h2 className="mt-2 text-xl font-semibold md:text-2xl">You May Also Like</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="cursor-pointer rounded-full bg-primary px-10 py-3 text-sm font-semibold transition hover:bg-primary-dull"
        >
          Show More
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default MovieDetails;

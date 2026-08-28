import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { KConverter } from '../../lib/KConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState('');
  const [showPrice, setShowPrice] = useState('');

  const [addingShow, setAddingShow] = useState(false);

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;

    const [date, time] = dateTimeInput.split('T');
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (
        !selectedMovies ||
        Object.keys(dateTimeSelection).length === 0 ||
        !showPrice
      ) {
        return toast('Missing Required Fields');
      }

      const showsInput = Object.entries(dateTimeSelection).flatMap(
        ([date, times]) =>
          times.map((time) => ({
            date,
            time,
          }))
      );

      const payload = {
        movieId: selectedMovies,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await axios.post('/api/show/add', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovies(null);
        setDateTimeSelection({});
        setShowPrice('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Submission Error: ', error);
      toast.error('An error Occured Please try again');
    }

    setAddingShow(false);
  };
  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error('Error Fetching Movies: ', error);
    }
  };

  return (
    <>
      <Title text1="Add" text2="Shows" />

      <p className="mt-10 text-lg font-semibold">Now Playing Movies</p>

      {nowPlayingMovies.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">
          No now-playing movies are available yet. Add movies from the Movies
          section first.
        </p>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="mt-4 flex w-max flex-wrap gap-4">
            {nowPlayingMovies.map((movie) => {
              const posterUrl = movie.poster_path?.startsWith('http')
                ? movie.poster_path
                : image_base_url + movie.poster_path;

              return (
                <div
                  key={movie._id}
                  className={`relative max-w-40 cursor-pointer transition ${
                    selectedMovies === movie._id ? 'opacity-100' : 'opacity-90 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedMovies(movie._id)}
                >
                  <div
                    className={`relative overflow-hidden rounded-xl border ${
                      selectedMovies === movie._id
                        ? 'border-primary shadow-lg shadow-primary/20'
                        : 'border-white/10'
                    }`}
                  >
                    <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-full object-cover brightness-90"
                    />
                    <div className="absolute bottom-0 left-0 flex w-full items-center justify-between bg-black/80 p-2 text-sm backdrop-blur-sm">
                      <p className="flex items-center gap-1 text-zinc-300">
                        <StarIcon className="size-4 fill-primary text-primary" />
                        {Number(movie.vote_average || 0).toFixed(1)}
                      </p>
                      <p className="text-zinc-300">{movie.runtime}m</p>
                    </div>
                  </div>
                  {selectedMovies === movie._id && (
                    <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-md bg-primary">
                      <CheckIcon className="size-4 text-white" strokeWidth={2.5} />
                    </div>
                  )}

                  <p className="mt-2 truncate font-medium">{movie.title}</p>
                  <p className="text-sm text-zinc-400">{movie.release_date}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium">Show Price</label>
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-surface px-3.5 py-2.5">
          <p className="text-sm text-zinc-400">{currency}</p>
          <input
            type="number"
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter Show Price"
            className="bg-transparent outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Select Date and Time</label>
        <div className="inline-flex gap-3 rounded-xl border border-white/10 bg-surface p-1 pl-3">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="rounded-md bg-transparent outline-none"
          />
          <button
            onClick={handleDateTimeAdd}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dull"
          >
            Add Time
          </button>
        </div>
      </div>

      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-semibold">Selected Date-Time</h2>
          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <li key={date}>
                <div className="font-medium">{date}</div>
                <div className="mt-1.5 flex flex-wrap gap-2 text-sm">
                  {times.map((time) => (
                    <div
                      key={`${date}-${time}`}
                      className="inline-flex items-center rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1"
                    >
                      <span>{time}</span>
                      <DeleteIcon
                        className="ml-2 cursor-pointer text-red-400 transition hover:text-red-300"
                        width={15}
                        onClick={() => handleRemoveTime(date, time)}
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="mt-8 cursor-pointer rounded-full bg-primary px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dull disabled:opacity-60"
      >
        Add Show
      </button>
    </>
  );
};
export default AddShows;

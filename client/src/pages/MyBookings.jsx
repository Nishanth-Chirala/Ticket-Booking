import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';
import timeFormat from '../lib/timeFormat';
import { dateFormat } from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, getToken, user, image_base_url } = useAppContext();

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  return !loading ? (
    <div className="relative min-h-[80vh] px-6 pt-28 pb-20 md:px-16 md:pt-36 lg:px-40">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" left="600px" />

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-surface-2 px-6 py-16 text-center">
          <p className="text-lg font-medium">No bookings yet</p>
          <p className="mt-2 text-sm text-zinc-400">
            Your tickets will appear here after you book a show.
          </p>
          <Link
            to="/movies"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-semibold transition hover:bg-primary-dull"
          >
            Browse Movies
          </Link>
        </div>
      ) : (
        bookings.map((item, index) => (
          <div
            key={index}
            className="mt-4 flex max-w-3xl flex-col justify-between overflow-hidden rounded-2xl border border-primary/20 bg-primary/8 md:flex-row"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={
                  item.show.movie.poster_path?.startsWith('http')
                    ? item.show.movie.poster_path
                    : image_base_url + item.show.movie.poster_path
                }
                alt={item.show.movie.title}
                className="aspect-video h-auto object-cover object-bottom md:max-w-45"
              />

              <div className="flex flex-col p-4 md:p-5">
                <p className="text-lg font-semibold">{item.show.movie.title}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  {timeFormat(item.show.movie.runtime)}
                </p>
                <p className="mt-auto pt-3 text-sm text-zinc-400">
                  {dateFormat(item.show.showDateTime)}
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between border-t border-primary/10 p-4 md:items-end md:border-t-0 md:border-l md:p-5 md:text-right">
              <div className="flex items-center gap-3 md:justify-end">
                <p className="min-w-[80px] text-2xl font-semibold tabular-nums">
                  {currency} {item.amount}
                </p>
                {!item.isPaid && (
                  <Link
                    to={item.paymentLink}
                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold transition hover:bg-primary-dull"
                  >
                    Pay Now
                  </Link>
                )}
                {item.isPaid && (
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                    Paid
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1 text-sm md:mt-0">
                <p>
                  <span className="text-zinc-400">Total Tickets: </span>
                  {item.bookedSeats.length}
                </p>
                <p>
                  <span className="text-zinc-400">Seat Number: </span>
                  {item.bookedSeats.join(', ')}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;

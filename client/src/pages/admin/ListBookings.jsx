import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      setBookings(data.bookings);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />

      <div className="mt-8 max-w-4xl overflow-hidden rounded-xl border border-primary/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-nowrap">
            <thead>
              <tr className="bg-primary/20 text-left text-sm text-white">
                <th className="p-3 pl-5 font-semibold">User Name</th>
                <th className="p-3 font-semibold">Movie Name</th>
                <th className="p-3 font-semibold">Show Time</th>
                <th className="p-3 font-semibold">Seats</th>
                <th className="p-3 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {bookings?.map((item, index) => (
                <tr
                  key={index}
                  className="border-t border-primary/15 bg-primary/5 even:bg-primary/10"
                >
                  <td className="min-w-45 p-3 pl-5 font-medium">{item.user?.name}</td>
                  <td className="p-3">{item.show.movie.title}</td>
                  <td className="p-3 text-zinc-300">{dateFormat(item.show.showDateTime)}</td>
                  <td className="p-3 text-zinc-300">
                    {Object.keys(item.bookedSeats)
                      .map((seat) => item.bookedSeats[seat])
                      .join(', ')}
                  </td>
                  <td className="p-3 font-medium">
                    {currency} {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};
export default ListBookings;

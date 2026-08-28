import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';

const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user } = useAppContext();

  const [shows, setShows] = useState([]);

  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-shows', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      setShows(data.shows);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllShows();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />

      <div className="mt-8 max-w-4xl overflow-hidden rounded-xl border border-primary/20">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-nowrap">
            <thead>
              <tr className="bg-primary/20 text-left text-sm text-white">
                <th className="p-3 pl-5 font-semibold">Movie Name</th>
                <th className="p-3 font-semibold">Show Time</th>
                <th className="p-3 font-semibold">Total Bookings</th>
                <th className="p-3 font-semibold">Earnings</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {shows?.map((show, index) => (
                <tr
                  key={index}
                  className="border-t border-primary/15 bg-primary/5 even:bg-primary/10"
                >
                  <td className="min-w-45 p-3 pl-5 font-medium">{show.movie.title}</td>
                  <td className="p-3 text-zinc-300">{dateFormat(show.showDateTime)}</td>
                  <td className="p-3 text-zinc-300">
                    {Object.keys(show.occupiedSeats).length}
                  </td>
                  <td className="p-3 font-medium">
                    {currency}
                    {Object.keys(show.occupiedSeats).length * show.showPrice}
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
export default ListShows;

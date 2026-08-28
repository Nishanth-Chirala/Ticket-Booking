import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();

  const [dashBoardData, SetDashBoardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });

  const [loading, setLoading] = useState(true);

  const dashBoardCards = [
    {
      title: 'Total Bookings',
      value: dashBoardData.totalBookings || '0',
      icon: ChartLineIcon,
    },
    {
      title: 'Total Revenue',
      value: currency + dashBoardData.totalRevenue || '0',
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Active Shows',
      value: dashBoardData.activeShows.length || '0',
      icon: PlayCircleIcon,
    },
    {
      title: 'Total Users',
      value: dashBoardData.totalUser || '0',
      icon: UsersIcon,
    },
  ];

  const fetchDashBoardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        SetDashBoardData(data.dashBoardData);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error Fetching DashBoard Data: ', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashBoardData();
    }
  }, [user]);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative mt-8 flex flex-wrap gap-4">
        <BlurCircle top="-100px" left="0px" />
        <div className="flex w-full flex-wrap gap-4">
          {dashBoardCards.map((card, index) => (
            <div
              key={index}
              className="flex w-full max-w-50 items-center justify-between rounded-xl border border-primary/20 bg-primary/10 px-4 py-4"
            >
              <div>
                <h1 className="text-xs font-medium text-zinc-400">{card.title}</h1>
                <p className="mt-1 text-xl font-semibold">{card.value}</p>
              </div>
              <div className="rounded-lg bg-primary/15 p-2">
                <card.icon className="size-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-lg font-semibold">Active Shows</p>
      <div className="relative mt-5 flex max-w-5xl flex-wrap gap-5">
        <BlurCircle top="100px" left="-10%" />
        {dashBoardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 overflow-hidden rounded-xl border border-primary/20 bg-primary/10 pb-3 transition duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <img
              src={
                show.movie.poster_path?.startsWith('http')
                  ? show.movie.poster_path
                  : image_base_url + show.movie.poster_path
              }
              alt={show.movie.title}
              className="h-60 w-full object-cover"
            />

            <p className="truncate p-3 pb-1 font-medium">{show.movie.title}</p>
            <div className="flex items-center justify-between px-3">
              <p className="text-lg font-semibold">
                {currency} {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-zinc-400">
                <StarIcon className="size-4 fill-primary text-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>

            <p className="px-3 pt-2 text-sm text-zinc-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default Dashboard;

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
      <Title text1="Admin" text2="DashBoard" />

      <div className="relative flex flex-wrap gap-4 mt-6">
        <BlurCircle top="-100px" left="0px" />
        <div className="flex flex-wrap gap-4 w-full">
          {dashBoardCards.map((card, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-50 w-full"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>

      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative flex flex-wrap gap-6 mt-4 max-w-5xl">
        <BlurCircle top="100px" left="-10%" />
        {dashBoardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
          >
            <img
              src={image_base_url + show.movie.poster_path}
              alt="image_shows"
              className="h-60 w-full object-cover"
            />
            <p className="font-medium p-2 truncate">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className=" text-lg font-medium">
                {currency} {show.showPrice}
              </p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>

            <p className="px-2 pt-2 text-sm text-gray-500">
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

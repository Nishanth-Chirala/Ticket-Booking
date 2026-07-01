import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AppContext } from './AppContextInstance';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;



export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const { user } = useUser();
  const { getToken } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get('/api/admin/is-admin', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast.error('You are not authorized to access the admin dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get('/api/user/favorites', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
        
      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
      const fetchShows = async () => {
    try {
      const { data } = await axios.get('/api/show/all');
      if (data.success) {
        setShows(data.shows);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

    fetchShows();
  }, []);

  useEffect(() => {
    if (user) {
          const fetchIsAdmin = async () => {
    try {
      const { data } = await axios.get('/api/admin/is-admin', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      setIsAdmin(data.isAdmin);

      if (!data.isAdmin && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast.error('You are not authorized to access the admin dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get('/api/user/favorites', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [user,getToken,navigate,location.pathname]);

  const value = {
    axios,
    fetchFavoriteMovies,
    fetchIsAdmin,
    user,
    getToken,
    navigate,
    isAdmin,
    shows,
    favoriteMovies,
    image_base_url,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const TOKEN_KEY = 'quickshow_token';

export const AppContext = createContext();

const hasAdminAccess = (role) => role === 'admin' || role === 'owner';

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [authLoading, setAuthLoading] = useState(true);
  const [adminRequest, setAdminRequest] = useState(null);

  const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const getToken = async () => token || localStorage.getItem(TOKEN_KEY);

  const applyRoleFlags = (nextUser) => {
    setIsAdmin(hasAdminAccess(nextUser?.role));
    setIsOwner(nextUser?.role === 'owner');
  };

  const persistAuth = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setToken(nextToken);
    setUser(nextUser);
    applyRoleFlags(nextUser);
  };

  const logout = () => {
    persistAuth(null, null);
    setFavoriteMovies([]);
    setAdminRequest(null);
    toast.success('Logged out');
    navigate('/');
  };

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });

    if (data.success) {
      persistAuth(data.token, data.user);
      toast.success(data.message);
      return data;
    }

    toast.error(data.message);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', {
      name,
      email,
      password,
    });

    if (data.success) {
      persistAuth(data.token, data.user);
      toast.success(data.message);
      return data;
    }

    toast.error(data.message);
    return data;
  };

  const fetchIsAdmin = async () => {
    try {
      const authToken = token || localStorage.getItem(TOKEN_KEY);
      const { data } = await axios.get('/api/admin/is-admin', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const admin = Boolean(data.success && data.isAdmin);
      setIsAdmin(admin);

      if (!admin && location.pathname.startsWith('/admin')) {
        navigate('/');
        toast.error('You are not authorized to access the admin dashboard');
      }
    } catch (error) {
      setIsAdmin(false);
      console.error(error);
    }
  };

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

  const fetchFavoriteMovies = async () => {
    try {
      const { data } = await axios.get('/api/user/favorites', {
        headers: { Authorization: `Bearer ${token}` },
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

  const fetchMyAdminRequest = async () => {
    try {
      const { data } = await axios.get('/api/admin-requests/my-request', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setAdminRequest(data.request);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const requestAdminAccess = async (message = '') => {
    try {
      const { data } = await axios.post(
        '/api/admin-requests/request',
        { message },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setAdminRequest(data.request);
        toast.success(data.message);
        return data;
      }

      toast.error(data.message);
      return data;
    } catch (error) {
      console.error(error);
      toast.error('Unable to submit request');
      return { success: false };
    }
  };

  const fetchMe = async () => {
    if (!token) {
      setUser(null);
      applyRoleFlags(null);
      setAuthLoading(false);
      return;
    }

    try {
      const { data } = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUser(data.user);
        applyRoleFlags(data.user);

        try {
          const adminRes = await axios.get('/api/admin/is-admin', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAdmin(Boolean(adminRes.data.success && adminRes.data.isAdmin));
        } catch {
          setIsAdmin(hasAdminAccess(data.user.role));
        }
      } else {
        persistAuth(null, null);
      }
    } catch (error) {
      persistAuth(null, null);
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
  }, []);

  useEffect(() => {
    setAuthLoading(true);
    fetchMe();
  }, [token]);

  useEffect(() => {
    if (user && token) {
      fetchFavoriteMovies();
      if (user.role === 'user') {
        fetchMyAdminRequest();
      }
    }
  }, [user, token]);

  const value = {
    axios,
    fetchFavoriteMovies,
    fetchIsAdmin,
    user,
    getToken,
    token,
    login,
    register,
    logout,
    navigate,
    isAdmin,
    isOwner,
    shows,
    favoriteMovies,
    image_base_url,
    authLoading,
    adminRequest,
    requestAdminAccess,
    fetchMyAdminRequest,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);

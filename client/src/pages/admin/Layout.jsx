import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/admin/AdminNavbar';
import AdminSideBar from '../../components/admin/AdminSideBar';
import { useAppContext } from '../../context/AppContext';
import { useEffect } from 'react';
import Loading from '../../components/Loading';

const Layout = () => {
  const { isAdmin, fetchIsAdmin } = useAppContext();

  useEffect(() => {
    fetchIsAdmin();
  }, []);

  return isAdmin ? (
    <div className="min-h-screen bg-[#09090b]">
      <AdminNavbar />
      <div className="flex">
        <AdminSideBar />
        <div className="h-[calc(100vh-64px)] flex-1 overflow-y-auto px-4 py-8 md:px-10 md:py-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;

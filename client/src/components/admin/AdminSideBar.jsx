import {
  FilmIcon,
  LayoutDashboardIcon,
  ListCollapseIcon,
  ListIcon,
  PlusSquareIcon,
  ShieldCheck,
} from 'lucide-react';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminSideBar = () => {
  const { user, isOwner } = useAppContext();

  const adminNavLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Movies', path: '/admin/add-movies', icon: FilmIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    {
      name: 'List Bookings',
      path: '/admin/list-bookings',
      icon: ListCollapseIcon,
    },
  ];

  if (isOwner) {
    adminNavLinks.push({
      name: 'Admin Requests',
      path: '/admin/requests',
      icon: ShieldCheck,
    });
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full max-w-13 flex-col items-center border-r border-white/10 bg-surface pt-8 text-sm md:max-w-60">
      <img
        src={user?.image || assets.profile}
        alt="Admin"
        className="size-10 rounded-full object-cover ring-2 ring-primary/30 md:size-14"
      />

      <p className="mt-3 hidden text-base font-medium md:block">
        {user?.name || 'Admin User'}
      </p>
      <p className="mt-0.5 hidden text-xs capitalize text-zinc-500 md:block">
        {user?.role || 'admin'}
      </p>

      <div className="mt-6 w-full">
        {adminNavLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end
            className={({ isActive }) =>
              `relative flex w-full items-center gap-2 py-2.5 text-zinc-400 transition first:mt-0 max-md:justify-center min-md:pl-10 ${
                isActive
                  ? 'bg-primary/15 font-medium text-primary'
                  : 'hover:bg-white/5 hover:text-zinc-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="size-5" />
                <p className="max-md:hidden">{link.name}</p>
                <span
                  className={`absolute right-0 h-8 w-1 rounded-l ${
                    isActive ? 'bg-primary' : ''
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSideBar;

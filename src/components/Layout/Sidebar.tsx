import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CreditCard, 
  FileText, 
  Clock,
  Sheet,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ];

    if (user?.role === 'manager') {
      return [
        ...baseItems,
        { path: '/sales', icon: TrendingUp, label: 'Sales' },
        { path: '/attendance', icon: Users, label: 'Attendance' },
        { path: '/cashflow', icon: DollarSign, label: 'Cashflow' },
        { path: '/payroll', icon: CreditCard, label: 'Payroll' },
        { path: '/proposals', icon: FileText, label: 'Proposals' },
        { path: '/overtime', icon: Clock, label: 'Overtime' },
        { path: '/sheets', icon: Sheet, label: 'Google Sheets' }
      ];
    }

    if (user?.role === 'administrasi') {
      return [
        ...baseItems,
        { path: '/sales', icon: TrendingUp, label: 'Sales' },
        { path: '/attendance', icon: Users, label: 'Attendance' },
        { path: '/cashflow', icon: DollarSign, label: 'Cashflow' },
        { path: '/payroll', icon: CreditCard, label: 'Payroll' },
        { path: '/proposals', icon: FileText, label: 'Proposals' },
        { path: '/overtime', icon: Clock, label: 'Overtime' }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-300">{user?.name}</p>
        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
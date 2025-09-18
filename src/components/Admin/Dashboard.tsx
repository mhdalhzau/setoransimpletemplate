import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, FileText, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardStats {
  totalSales: number;
  totalStaff: number;
  pendingProposals: number;
  pendingOvertime: number;
  todayAttendance: number;
  cashflowBalance: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalStaff: 0,
    pendingProposals: 0,
    pendingOvertime: 0,
    todayAttendance: 0,
    cashflowBalance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      try {
        // This would be replaced with actual API calls
        setTimeout(() => {
          setStats({
            totalSales: 15750000,
            totalStaff: 12,
            pendingProposals: 3,
            pendingOvertime: 5,
            todayAttendance: 8,
            cashflowBalance: 2500000
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
  }> = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang, {user?.name}</p>
        <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Penjualan Hari Ini"
          value={formatRupiah(stats.totalSales)}
          icon={<TrendingUp size={24} />}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={<Users size={24} />}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        
        <StatCard
          title="Absensi Hari Ini"
          value={`${stats.todayAttendance}/${stats.totalStaff}`}
          icon={<Clock size={24} />}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        
        <StatCard
          title="Saldo Cashflow"
          value={formatRupiah(stats.cashflowBalance)}
          icon={<DollarSign size={24} />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        
        <StatCard
          title="Proposal Pending"
          value={stats.pendingProposals}
          icon={<FileText size={24} />}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
        
        <StatCard
          title="Lembur Pending"
          value={stats.pendingOvertime}
          icon={<AlertCircle size={24} />}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <TrendingUp className="text-green-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Lihat Penjualan</p>
            <p className="text-sm text-gray-600">Laporan penjualan terbaru</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="text-blue-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Kelola Absensi</p>
            <p className="text-sm text-gray-600">Approve absensi staff</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <FileText className="text-orange-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Review Proposal</p>
            <p className="text-sm text-gray-600">Approve/reject proposal</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <DollarSign className="text-yellow-600 mb-2" size={20} />
            <p className="font-medium text-gray-900">Input Cashflow</p>
            <p className="text-sm text-gray-600">Tambah data cashflow</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Staff John Doe submit absensi</p>
              <p className="text-xs text-gray-600">2 menit yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Proposal "Renovasi Toilet" diajukan</p>
              <p className="text-xs text-gray-600">15 menit yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Cashflow masuk Rp 500.000</p>
              <p className="text-xs text-gray-600">1 jam yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
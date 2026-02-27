import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import { getAllUsers } from '../../services/userService';
import { getAllProjects } from '../../services/projectService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalEmployees: 0,
    totalProjects: 0,
    completedProjects: 0,
    inProgressProjects: 0,
  });
  const [recentActivity] = useState([
    { action: 'New project created', user: 'John Doe', time: '2 minutes ago', icon: '📁', color: 'text-blue-600' },
    { action: 'User registered', user: 'Jane Smith', time: '15 minutes ago', icon: '👤', color: 'text-green-600' },
    { action: 'Project completed', user: 'Mike Johnson', time: '1 hour ago', icon: '✅', color: 'text-purple-600' },
    { action: 'Message received', user: 'Sarah Williams', time: '2 hours ago', icon: '💬', color: 'text-orange-600' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Example revenue amount (replace with real data source as needed)
  // Values are assumed to be in INR directly; no USD conversion necessary.
  const revenueInr = 45200; // ₹45,200 example
  const formattedRevenueInr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(revenueInr);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, projectsRes] = await Promise.all([
        getAllUsers(),
        getAllProjects(),
      ]);

      const users = usersRes.data;
      const projects = projectsRes.data;

      setStats({
        totalUsers: users.length,
        totalClients: users.filter((u) => u.role === 'client').length,
        totalEmployees: users.filter((u) => u.role === 'employee').length,
        totalProjects: projects.length,
        completedProjects: projects.filter((p) => p.status === 'Completed').length,
        inProgressProjects: projects.filter((p) => p.status === 'In Progress').length,
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const StatCard = ({ title, value, icon, gradient, iconBg, delay }) => (
    <div 
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 hover:border-gray-300 transition-all duration-300 hover:transform hover:scale-105 overflow-hidden group slide-in-up shadow-lg"
      style={{ animationDelay: delay }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconBg} p-3 rounded-xl`}>
            {icon}
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium text-green-400">Active</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-4xl font-bold text-gray-800">{value}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👨‍💼 Admin Control Center</h1>
              <p className="text-orange-100 text-lg">Manage your entire system from one place</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl px-6 py-4">
                <p className="text-sm text-orange-100">Today's Date</p>
                <p className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="TOTAL USERS"
          value={stats.totalUsers}
          gradient="from-blue-500 to-cyan-500"
          iconBg="bg-blue-500/10"
          delay="0.1s"
          icon={
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="TOTAL CLIENTS"
          value={stats.totalClients}
          gradient="from-green-500 to-emerald-500"
          iconBg="bg-green-500/10"
          delay="0.2s"
          icon={
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <StatCard
          title="TOTAL EMPLOYEES"
          value={stats.totalEmployees}
          gradient="from-purple-500 to-pink-500"
          iconBg="bg-purple-500/10"
          delay="0.3s"
          icon={
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="TOTAL PROJECTS"
          value={stats.totalProjects}
          gradient="from-orange-500 to-amber-500"
          iconBg="bg-orange-500/10"
          delay="0.4s"
          icon={
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        
        <StatCard
          title="COMPLETED PROJECTS"
          value={stats.completedProjects}
          gradient="from-teal-500 to-cyan-500"
          iconBg="bg-teal-500/10"
          delay="0.5s"
          icon={
            <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="IN PROGRESS"
          value={stats.inProgressProjects}
          gradient="from-yellow-500 to-orange-500"
          iconBg="bg-yellow-500/10"
          delay="0.6s"
          icon={
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activity - Left Side */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📊 Recent Activity</h2>
              <button className="text-sm text-teal-600 hover:text-teal-700 font-semibold">View All →</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="text-3xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats - Right Side */}
        <div>
          <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white mb-6">
            <h3 className="text-lg font-semibold mb-4">⚡ Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <p className="text-sm text-orange-100">Success Rate</p>
                <p className="text-3xl font-bold">{stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <p className="text-sm text-orange-100">Active Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <p className="text-sm text-orange-100">Total Revenue</p>
                <p className="text-3xl font-bold">{formattedRevenueInr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl shadow-lg p-6 mb-8 border-2 border-teal-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => navigate('/admin/users')}
            className="bg-white hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
            + Add User
          </button>
          <button 
            onClick={() => navigate('/admin/projects')}
            className="bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
            + New Project
          </button>
          <button 
            onClick={() => navigate('/admin/messages')}
            className="bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
            📧 Messages
          </button>
          <button 
            onClick={() => navigate('/admin/users')}
            className="bg-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

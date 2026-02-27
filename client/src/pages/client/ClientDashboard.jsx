import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { getMyProjects } from '../../services/projectService';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getMyProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalProjects: projects.length,
    pending: projects.filter((p) => p.status === 'Pending').length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
  };

  const filteredProjects = activeTab === 'all' ? projects : projects.filter(p => p.status === activeTab);

  if (loading) return <Loader />;

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👋 Welcome Back, Client!</h1>
              <p className="text-blue-100 text-lg">Track your projects and collaborate with our team</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-8 py-6 text-center">
                <p className="text-sm text-blue-100 mb-1">Active Projects</p>
                <p className="text-5xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <span className="text-4xl">📁</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-blue-100">Total Projects</h3>
          <p className="text-4xl font-bold mt-2">{stats.totalProjects}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <span className="text-4xl">⏸️</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-yellow-100">Pending</h3>
          <p className="text-4xl font-bold mt-2">{stats.pending}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <span className="text-4xl">⏳</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-purple-100">In Progress</h3>
          <p className="text-4xl font-bold mt-2">{stats.inProgress}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-4 rounded-xl">
              <span className="text-4xl">✅</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-green-100">Completed</h3>
          <p className="text-4xl font-bold mt-2">{stats.completed}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex border-2 border-blue-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-blue-50'
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveTab('In Progress')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'In Progress'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('Completed')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            activeTab === 'Completed'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-green-50'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600">You don't have any projects yet.</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-blue-100 hover:border-blue-300 transform hover:-translate-y-1"
            >
              <div className={`h-2 ${
                project.status === 'Completed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : project.status === 'In Progress'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'In Progress'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Budget: ₹{project.budget || project.service?.price || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Old Table View */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border-2 border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          Project Details
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Deadline</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Employees</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-t">
                  <td className="px-4 py-3">{project.title}</td>
                  <td className="px-4 py-3">{project.service?.title}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(project.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {project.assignedEmployees?.length || 0} assigned
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ClientDashboard;

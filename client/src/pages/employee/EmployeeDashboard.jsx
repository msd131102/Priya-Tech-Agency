import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { getMyProjects } from '../../services/projectService';
import toast from 'react-hot-toast';

const EmployeeDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayTasks] = useState([
    { task: 'Complete project documentation', priority: 'High', time: '10:00 AM' },
    { task: 'Team meeting discussion', priority: 'Medium', time: '2:00 PM' },
    { task: 'Code review', priority: 'Low', time: '4:00 PM' },
  ]);

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

  const getProductivityScore = () => {
    if (stats.totalProjects === 0) return 0;
    return Math.round((stats.completed / stats.totalProjects) * 100);
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      {/* Header with Productivity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">💼 Employee Workspace</h1>
            <p className="text-cyan-100 text-lg mb-6">Manage your tasks and track your progress</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <p className="text-sm text-cyan-100">Tasks Today</p>
                <p className="text-3xl font-bold">{todayTasks.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4">
                <p className="text-sm text-cyan-100">Active Projects</p>
                <p className="text-3xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Score */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h3 className="text-lg font-semibold text-green-100 mb-4">Your Productivity</h3>
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                className="text-green-200"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
              <circle
                className="text-white"
                strokeWidth="8"
                strokeDasharray={`${getProductivityScore() * 3.51} 351`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="56"
                cx="64"
                cy="64"
              />
            </svg>
            <span className="absolute text-3xl font-bold">{getProductivityScore()}%</span>
          </div>
          <p className="text-green-100">Keep up the great work!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProjects}</p>
            </div>
            <div className="bg-teal-100 p-4 rounded-xl">
              <span className="text-3xl">📁</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-xl">
              <span className="text-3xl">⏸️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-xl">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-xl">
              <span className="text-3xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">📅</span>
            Today's Tasks
          </h2>
          <div className="space-y-4">
            {todayTasks.map((task, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:shadow-md transition-all duration-300">
                <input type="checkbox" className="w-5 h-5 text-teal-600 rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{task.task}</p>
                  <p className="text-sm text-gray-600">{task.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3">🚀</span>
            Recent Projects
          </h2>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project._id} className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{project.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📅 {new Date(project.deadline).toLocaleDateString()}</span>
                      <span>💰 ₹{project.budget || project.service?.price || 0}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    project.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-3">📋</span>
          All Assigned Projects
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Client</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-t">
                  <td className="px-4 py-3">{project.title}</td>
                  <td className="px-4 py-3">{project.client?.name}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;

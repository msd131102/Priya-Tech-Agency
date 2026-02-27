import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { getMyProjects, updateProjectStatus } from '../../services/projectService';
import toast from 'react-hot-toast';

const EmployeeProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

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

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await updateProjectStatus(selectedProject._id, newStatus);
      toast.success('Project status updated successfully');
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openStatusModal = (project) => {
    setSelectedProject(project);
    setNewStatus(project.status);
    setShowModal(true);
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Assigned Projects</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid gap-6">
          {projects.map((project) => (
            <div key={project._id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Client</span>
                      <p className="font-semibold">{project.client?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Service</span>
                      <p className="font-semibold">{project.service?.title}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <p>
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
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Deadline</span>
                      <p className="font-semibold">
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openStatusModal(project)}
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
              <div>
                <span className="text-sm text-gray-500">Team Members</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.assignedEmployees?.map((emp) => (
                    <span key={emp._id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {emp.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No projects assigned yet.
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Update Project Status"
      >
        <form onSubmit={handleUpdateStatus}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Project</label>
            <p className="font-semibold text-lg">{selectedProject?.title}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default EmployeeProjects;

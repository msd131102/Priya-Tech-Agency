import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { getMyProjects } from '../../services/projectService';
import { getAllServices } from '../../services/serviceService';
import { sendServiceRequest } from '../../services/serviceRequestService';
import toast from 'react-hot-toast';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching data...');
      
      const [projectsRes, servicesRes] = await Promise.all([
        getMyProjects(),
        getAllServices(),
      ]);

      console.log('📦 Full Services Response:', servicesRes);
      console.log('📋 Services Data Array:', servicesRes.data);
      console.log('📊 Number of services:', servicesRes.data?.length || 0);
      
      setProjects(projectsRes.data || []);
      setServices(servicesRes.data || []);
      
      console.log('✅ State updated - Services count:', servicesRes.data?.length || 0);
      toast.success('Data refreshed successfully! 🔄');
    } catch (error) {
      console.error('❌ Fetch error:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    setShowModal(true);
    // Refresh services when opening modal to ensure latest data
    if (services.length === 0) {
      try {
        const servicesRes = await getAllServices();
        console.log('🔄 Refreshed services in modal:', servicesRes.data);
        setServices(servicesRes.data || []);
      } catch (error) {
        console.error('Error refreshing services:', error);
        toast.error('Could not load services');
      }
    }
  };

  const handleServiceRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await sendServiceRequest({
        serviceId: formData.service,
        description: formData.description,
      });

      toast.success('Service request sent to admin successfully! 🎉');
      setShowModal(false);
      setFormData({ service: '', description: '' });
    } catch (error) {
      console.error('Service request error:', error);
      toast.error(error.response?.data?.message || 'Failed to send service request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Projects</h1>
        <div className="flex gap-3">
          <button
            onClick={() => fetchData()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            title="Refresh data"
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            + Request Service
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div>
                    <span className="text-sm text-gray-500">Assigned Team</span>
                    <p className="font-semibold">{project.assignedEmployees?.length || 0} employees</p>
                  </div>
                </div>
              </div>
            </div>
            {project.assignedEmployees?.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Team Members</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.assignedEmployees.map((emp) => (
                    <span key={emp._id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {emp.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
            No projects yet. Request a service to get started!
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Request New Service"
      >
        <form onSubmit={handleServiceRequest}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Service</label>
            {services.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-3">
                ⚠️ No services available. Click the <strong>🔄 Refresh</strong> button to load services.
              </div>
            )}
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              required
              disabled={services.length === 0}
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title} - ₹{service.price}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Project Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              rows="5"
              placeholder="Describe your requirements..."
              required
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              Your service request will be sent to the admin for approval.
            </p>
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
              disabled={submitting || services.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ClientProjects;

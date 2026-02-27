import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import { 
  getAllServiceRequests, 
  approveServiceRequest, 
  rejectServiceRequest 
} from '../../services/serviceRequestService';
import { getAllUsers } from '../../services/userService';
import toast from 'react-hot-toast';

const AdminServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [action, setAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    adminNotes: '',
    projectTitle: '',
    deadline: '',
    assignedEmployees: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching service requests...');
      
      const [requestsRes, usersRes] = await Promise.all([
        getAllServiceRequests(),
        getAllUsers(),
      ]);
      
      console.log('📦 Service Requests Response:', requestsRes);
      console.log('📋 Requests Data:', requestsRes.data);
      console.log('👥 Users Data:', usersRes.data);
      
      const requestsArray = requestsRes.data || [];
      const usersArray = usersRes.data || [];
      
      setRequests(requestsArray);
      setEmployees(usersArray.filter((u) => u.role === 'employee'));
      
      console.log('✅ State updated:', {
        requestsCount: requestsArray.length,
        employeesCount: usersArray.filter((u) => u.role === 'employee').length
      });
      
      toast.success(`Loaded ${requestsArray.length} service requests`);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      console.error('Error details:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || 'Failed to fetch service requests';
      toast.error(errorMsg);
      setError(errorMsg);
      setRequests([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const openApprovalModal = (request) => {
    console.log('Opening approval modal for request:', request);
    
    // Check if request is still pending
    if (request.status !== 'Pending') {
      toast.error('This request has already been processed');
      fetchData(); // Refresh to show current state
      return;
    }
    
    setSelectedRequest(request);
    setAction('approve');
    setFormData({
      adminNotes: '',
      projectTitle: `${request?.service?.title || 'Service'} for ${request?.client?.name || 'Client'}`,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedEmployees: [],
      budget: request?.service?.price || 0, // default budget from service price
    });
    setShowModal(true);
  };

  const openRejectionModal = (request) => {
    console.log('Opening rejection modal for request:', request);
    
    // Check if request is still pending
    if (request.status !== 'Pending') {
      toast.error('This request has already been processed');
      fetchData(); // Refresh to show current state
      return;
    }
    
    setSelectedRequest(request);
    setAction('reject');
    setFormData({
      adminNotes: '',
      projectTitle: '',
      deadline: '',
      assignedEmployees: [],
      budget: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting action:', action);
    console.log('Selected request:', selectedRequest);
    console.log('Form data:', formData);
    
    // Double check status before submitting
    if (selectedRequest.status !== 'Pending') {
      toast.error('This request has already been processed');
      setShowModal(false);
      fetchData();
      return;
    }
    
    try {
      if (action === 'approve') {
        if (!formData.projectTitle || !formData.deadline || !formData.budget) {
          toast.error('Please fill in all required fields');
          return;
        }
        await approveServiceRequest(selectedRequest._id, formData);
        toast.success('Service request approved! Project created successfully');
      } else {
        if (!formData.adminNotes) {
          toast.error('Please provide a rejection reason');
          return;
        }
        console.log('Rejecting with notes:', formData.adminNotes);
        await rejectServiceRequest(selectedRequest._id, { adminNotes: formData.adminNotes });
        toast.success('Service request rejected successfully');
      }
      setShowModal(false);
      setFormData({
        adminNotes: '',
        projectTitle: '',
        deadline: '',
        assignedEmployees: [],
      });
      fetchData();
    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error.response?.data?.message || 'Operation failed';
      toast.error(errorMsg);
      
      // If it was a 'already processed' error, close modal and refresh
      if (errorMsg.includes('already been processed')) {
        setShowModal(false);
        fetchData();
      }
    }
  };

  const toggleEmployee = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.includes(employeeId)
        ? prev.assignedEmployees.filter((id) => id !== employeeId)
        : [...prev.assignedEmployees, employeeId],
    }));
  };

  const filteredRequests = Array.isArray(requests) 
    ? requests.filter((req) => filterStatus === 'all' || req.status === filterStatus)
    : [];

  const stats = {
    total: requests.length || 0,
    pending: requests.filter((r) => r.status === 'Pending').length || 0,
    approved: requests.filter((r) => r.status === 'Approved').length || 0,
    rejected: requests.filter((r) => r.status === 'Rejected').length || 0,
  };

  console.log('📊 Current state:', {
    requestsLength: requests.length,
    filteredLength: filteredRequests.length,
    filterStatus,
    stats,
    error
  });

  if (loading) return <Loader />;

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Service Requests</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              📋 Service Requests
            </h1>
            <p className="text-gray-600">Approve or reject client service requests</p>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            title="Refresh service requests"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-yellow-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-red-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {['Pending', 'Approved', 'Rejected', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-600 text-lg">No service requests found</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div 
                key={request._id} 
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all border-l-4 ${
                  request.status === 'Pending' 
                    ? 'border-yellow-500' 
                    : request.status === 'Approved' 
                    ? 'border-green-500 opacity-75' 
                    : 'border-red-500 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg ${
                        request.status === 'Pending' 
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500' 
                          : request.status === 'Approved' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{request?.service?.title || 'N/A'}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Client</p>
                            <p className="font-semibold text-gray-800">{request?.client?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="font-semibold text-green-600">₹{request?.service?.price || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-1 ${
                                request.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                                  : request.status === 'Approved'
                                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                  : 'bg-red-100 text-red-800 border-2 border-red-300'
                              }`}
                            >
                              {request.status === 'Pending' && '⏳'}
                              {request.status === 'Approved' && '✅'}
                              {request.status === 'Rejected' && '❌'}
                              {request.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Requested</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Description</p>
                          <p className="text-gray-700">{request.description}</p>
                        </div>
                        {request.adminNotes && (
                          <div className="mt-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-600 font-semibold mb-1">Admin Notes</p>
                            <p className="text-gray-700">{request.adminNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {request.status === 'Pending' && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openApprovalModal(request)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => openRejectionModal(request)}
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={action === 'approve' ? 'Approve Service Request' : 'Reject Service Request'}
      >
        <form onSubmit={handleSubmit}>
          {action === 'approve' ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Title</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Budget (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Assign Employees (Optional)</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2">
                  {employees.map((employee) => (
                    <label key={employee._id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.assignedEmployees.includes(employee._id)}
                        onChange={() => toggleEmployee(employee._id)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{employee.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : null}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {action === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason'}
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              rows="4"
              required={action === 'reject'}
              placeholder={action === 'approve' ? 'Optional notes for the client' : 'Explain why the request is rejected'}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 ${
                action === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              } text-white px-6 py-2 rounded-lg font-semibold`}
            >
              {action === 'approve' ? 'Approve & Create Project' : 'Reject Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default AdminServiceRequests;

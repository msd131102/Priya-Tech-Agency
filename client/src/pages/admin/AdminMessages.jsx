import { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import { getAllUsers } from '../../services/userService';
import { getMessages, sendMessage } from '../../services/messageService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AdminMessages = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    employees: users.filter(u => u.role === 'employee').length,
    clients: users.filter(u => u.role === 'client').length,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.filter((u) => u._id !== user._id));
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await getMessages(selectedUser._id);
      setMessages(response.data || []);
    } catch (error) {
      console.error('Fetch messages error:', error);
      toast.error('Failed to fetch messages');
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await sendMessage({
        receiverId: selectedUser._id,
        message: messageText,
      });
      setMessageText('');
      fetchMessages();
      toast.success('Message sent!');
    } catch (error) {
      console.error('Message send error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  if (loading) return <Loader />;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Messages
        </h1>
        <p className="text-gray-400">Communicate with your team and clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg slide-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Total Contacts</span>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg slide-in-up" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Admins</span>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.admins}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg slide-in-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Employees</span>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.employees}</p>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300 shadow-lg slide-in-up" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Clients</span>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.clients}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 450px)', minHeight: '500px' }}>
        {/* Users List */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden slide-in-up shadow-lg" style={{animationDelay: '0.4s'}}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-lg mb-4 text-gray-800">Contacts</h2>
            
            {/* Search Bar */}
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-800 placeholder-gray-500 text-sm"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-800 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>
          </div>
          
          <div className="overflow-y-auto" style={{height: 'calc(100% - 180px)'}}>
            {filteredUsers.length > 0 ? (
              <div className="space-y-1 p-2">
                {filteredUsers.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      selectedUser?._id === u._id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg'
                        : 'hover:bg-gray-100 border border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shadow-lg ${
                        u.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        u.role === 'employee' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold truncate ${
                          selectedUser?._id === u._id ? 'text-white' : 'text-gray-800'
                        }`}>
                          {u.name}
                        </div>
                        <div className={`text-xs capitalize ${
                          selectedUser?._id === u._id ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {u.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">No contacts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden slide-in-up shadow-lg" style={{animationDelay: '0.5s'}}>
          {selectedUser ? (
            <>
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                    selectedUser.role === 'admin' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    selectedUser.role === 'employee' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                    'bg-gradient-to-br from-green-500 to-green-600'
                  }`}>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-800">{selectedUser.name}</h2>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages && messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-4 flex ${
                        msg.sender._id === user._id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className="flex flex-col items-start max-w-xs lg:max-w-md">
                        {/* Sender Email */}
                        <div className={`mb-1 px-2 flex items-center gap-2 ${
                          msg.sender._id === user._id ? 'ml-auto flex-row-reverse' : ''
                        }`}>
                          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-500 font-medium">
                            {msg.sender.email}
                          </span>
                        </div>
                        
                        {/* Message Bubble */}
                        <div
                          className={`inline-block w-full px-5 py-3 rounded-2xl shadow-lg ${
                            msg.sender._id === user._id
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                              : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                          <p className={`text-xs mt-1.5 ${
                            msg.sender._id === user._id ? 'text-purple-100' : 'text-gray-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-medium">No messages yet</p>
                    <p className="text-gray-500 text-sm mt-1">Start the conversation!</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-800 placeholder-gray-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center gap-2"
                  >
                    <span>Send</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-semibold">Select a contact to start messaging</p>
              <p className="text-gray-500 text-sm mt-2">Choose someone from your contacts list</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminMessages;

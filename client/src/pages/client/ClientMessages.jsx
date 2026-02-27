import { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import { getMessageableUsers } from '../../services/userService';
import { getMessages, sendMessage } from '../../services/messageService';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ClientMessages = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);

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
      const response = await getMessageableUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load contacts');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          <h2 className="font-bold text-lg mb-4">Contacts</h2>
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition ${
                selectedUser?._id === u._id
                  ? 'bg-blue-100 border-l-4 border-blue-600'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-gray-500">{u.role}</div>
            </div>
          ))}
        </div>

        {/* Messages Area */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b">
                <h2 className="font-bold text-lg">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg) => (
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
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs text-gray-500 font-medium">
                          {msg.sender.email}
                        </span>
                      </div>
                      
                      {/* Message Bubble */}
                      <div
                        className={`inline-block w-full px-4 py-2 rounded-lg ${
                          msg.sender._id === user._id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a contact to start messaging
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClientMessages;

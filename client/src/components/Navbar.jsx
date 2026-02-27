import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/50';
      case 'employee':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/50';
      case 'client':
        return 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/50';
      default:
        return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-cyan-500/50';
    }
  };

  return (
    <nav className="bg-white border-b-2 border-teal-100 sticky top-0 z-50 shadow-lg shadow-teal-500/10">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">Priya Tech Agency</h1>
              <p className="text-xs text-gray-600">Project Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right mr-2">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${getRoleBadgeColor(user?.role)}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/50 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

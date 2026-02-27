import { Link } from 'react-router-dom';

const Login = () => {
  const roles = [
    {
      title: 'Client Portal',
      description: 'Track your projects and collaborate',
      icon: '👔',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      link: '/client/login',
      color: 'blue'
    },
    {
      title: 'Employee Portal',
      description: 'Manage tasks and productivity',
      icon: '💼',
      gradient: 'from-teal-500 via-cyan-500 to-blue-500',
      link: '/employee/login',
      color: 'teal'
    },
    {
      title: 'Admin Control',
      description: 'Full system management',
      icon: '👨‍💼',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      link: '/admin/login',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Priya Tech Agency
          </h1>
          <p className="text-gray-600 text-xl">Select your portal to continue</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {roles.map((role, index) => (
            <Link
              key={index}
              to={role.link}
              className="group relative"
            >
              <div className={`bg-gradient-to-br ${role.gradient} rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">{role.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {role.title}
                  </h2>
                  <p className="text-white/80 mb-6">
                    {role.description}
                  </p>
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl py-3 px-6 inline-flex items-center space-x-2 transform group-hover:bg-white/30 transition-all duration-300">
                    <span className="text-white font-semibold">Sign In</span>
                    <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 inline-block shadow-lg">
            <p className="text-gray-700 mb-3">
              Don't have an account?
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span>Create New Account</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-sm text-gray-500">
          © 2026 Priya Tech Agency. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

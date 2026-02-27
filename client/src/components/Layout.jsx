import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 relative" style={{ zIndex: 1 }}>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 min-h-screen relative" style={{ zIndex: 1 }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

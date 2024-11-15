import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogIn, UserPlus, LayoutDashboard, User, LogOut, ChevronDown } from 'lucide-react';
import { getUserProfile } from '../api/api'; // Kullanıcı verilerini almak için import edin

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null); // Profil resmi için state ekleyin

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile();
        setUsername(response.data.username);
        setProfileImage(response.data.profileImage); // Profil resmini state'e kaydedin
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownOpen && dropdownMenu && !event.composedPath().includes(dropdownMenu)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <BookOpen className="mr-2" /> YKS Assistant
        </Link>
        <div className="flex items-center space-x-4">
          {token ? (
            <div className="relative">
              <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-10 h-10 rounded-full mr-2" // Daire şeklinde profil resmi
                  />
                ) : (
                  <User size={18} className="mr-2" /> // Varsayılan ikon
                )}
                <span>{username}</span> {/* Dinamik kullanıcı adı */}
                <ChevronDown size={18} className="ml-2" />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
                  <NavLink to="/subjects" icon={<BookOpen size={18} />} text="Subjects" />
                  <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} text="Dashboard" />
                  <NavLink to="/profile" icon={<User size={18} />} text="Profile" />
                  <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100">
                    <LogOut size={18} />
                    <span className="ml-1">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" icon={<LogIn size={18} />} text="Login" />
              <NavLink to="/register" icon={<UserPlus size={18} />} text="Register" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
    {icon}
    <span className="ml-1">{text}</span>
  </Link>
);

export default Navbar;

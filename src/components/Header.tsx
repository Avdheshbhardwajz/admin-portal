import React, { useState } from 'react';
import logo from "../assets/Logo.png"; // Adjust the path of the logo as necessary

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white border-2 rounded-xl p-2 flex justify-between items-center font-poppins text-black relative shadow-[1px_5px_35px_10px_#0000004d]">
      {/* Menu Button for Toggling Sidebar */}
      <div className=' flex flex-row gap-5'>
      <button onClick={toggleSidebar} className="p-4  m-2 rounded-lg bg-[#00529B] text-white hover:bg-[#003F6B] transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Logo */}
      
        <img src={logo} alt="Logo" className="w-[50%] mr-2" />
     
      </div>
      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        {/* Import Button */}
        <button className="flex items-center bg-[#00529B] text-white px-3 py-2 rounded-lg hover:bg-[#003F6B] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Import
        </button>

        {/* Profile Icon and Dropdown */}
        <div className="relative">
          <button
            className="flex items-center p-2 rounded-full bg-[#00529B] hover:bg-[#003F6B] transition"
            onClick={toggleProfileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 19a8 8 0 0113.758 0M12 3a5 5 0 110 10a5 5 0 010-10z"
              />
            </svg>
          </button>

          {/* Profile dropdown menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#00529B] text-white rounded-lg shadow-lg py-2 z-50">
              <button className="block px-4 py-2 w-full text-left hover:bg-[#003F6B] transition">Settings</button>
              <button className="block px-4 py-2 w-full text-left hover:bg-[#003F6B] transition">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

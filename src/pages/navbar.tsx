import React from 'react';
import logo from './Logo2.png';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // Navigates to the home page
  };

  return (
    <div className="bg-gradient-to-r from-[#001E96] to-[#007ECC] w-full fixed top-0 z-50 p-5 flex items-center">
      <img 
        src={logo} 
        alt="Logo" 
        className="w-16 h-auto mr-5 cursor-pointer" 
        onClick={handleLogoClick} // Add onClick handler to navigate
      />
      <h1 className="text-white m-0 text-2xl flex-grow text-center font-sans">
        Document Extract Tool
      </h1>
    </div>
  );
};

export default Navbar;

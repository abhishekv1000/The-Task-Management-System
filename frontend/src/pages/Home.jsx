import React from "react";
import Sidebar from "../components/Home/Sidebar";
import { Outlet } from "react-router-dom";
const Home = () => {
  return (
    <div className="flex h-screen bg-[#121212] text-white p-6"> {/* Dark Background */}
      {/* Sidebar Section */}
    
      <Sidebar />
      {/* Content Section */}
      <div className="flex-1 bg-[#000000] p-3 rounded-lg shadow-lg border border-gray-600 mt-6 lg:mt-0 text-white transition-all duration-300 ease-in-out">
        {/* Outlet for nested routes */}
        <Outlet />
      </div>
    </div>
  );
};
export default Home;

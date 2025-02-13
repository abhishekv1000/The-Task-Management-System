import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa";
import { TbNotebookOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../apiurl";


const Sidebar = () => {
  const [Data, setData] = useState(null); // Data to store user details
  const [isNavbarOpen, setIsNavbarOpen] = useState(false); // For mobile toggle
  const history = useNavigate();

  // Navbar Links Data
  const data = [
    { title: "All Tasks", icon: <CgNotes />, link: "/" },
    { title: "Important Tasks", icon: <MdLabelImportant />, link: "/importantTasks" },
    { title: "Completed Tasks", icon: <FaCheckDouble />, link: "/completedTasks" },
    { title: "Incompleted Tasks", icon: <TbNotebookOff />, link: "/incompletedTasks" },
  ];

  // Logout function
  const logout = () => {
    localStorage.removeItem("id"); // Remove user ID from local storage
    localStorage.removeItem("token"); // Remove auth token from local storage
    history("/signup"); // Redirect to signup page
  };

  // Headers for API requests
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/v2/get-all-tasks`, // Replace with actual endpoint to get user data
          { headers }
        );
        setData(response.data.data); // Set user data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Check if user is authenticated
    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      fetchData(); // Fetch tasks if authenticated
    }
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white fixed top-0 left-0 z-50">
      <div className="flex justify-between items-center p-4">
        
        {/* Glowing Heading */}
        <div className="text-2xl font-semibold glow">
          THE TASK MANAGER
        </div>

        {/* User Info Section */}
       
        {/* Navbar Links */}
        <div className="flex space-x-8">
          {data.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="flex items-center p-3 text-lg rounded-xl bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-500 transition-all duration-300"
            >
              {item.icon} &nbsp; {item.title}
            </Link>
          ))}
        </div>


        <div className="flex items-center space-x-6">
          {Data ? (
            <div className="text-sm">
              <div className="font-semibold">{Data.username}</div> {/* Displaying username */}
              <div>{Data.email}</div> {/* Displaying email */}
            </div>
          ) : (
            <div>Loading...</div> // Show loading if data is not available
          )}
        </div>

        {/* Email and Logout Button */}
        <div className="flex items-center space-x-4">
           
            <div className="text-sm flex items-center space-x-2">
              {/* <span>{Data.email}</span> */}
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-xl text-white hover:from-red-700 hover:to-red-900 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden text-white text-2xl"
        onClick={() => setIsNavbarOpen(!isNavbarOpen)}
      >
        {isNavbarOpen ? "Close" : "Menu"}
      </button>

      {/* Mobile Navbar Links */}
      <div
        className={`${
          isNavbarOpen ? "block" : "hidden"
        } lg:hidden bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 space-y-4`}
      >
        {data.map((item, index) => (
          <Link
            to={item.link}
            key={index}
            className="flex items-center p-3 text-lg rounded-xl bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-500 transition-all duration-300"
          >
            {item.icon} &nbsp; {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

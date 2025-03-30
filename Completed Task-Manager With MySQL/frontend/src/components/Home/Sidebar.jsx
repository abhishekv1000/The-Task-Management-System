import React, { useEffect, useState } from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebookOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth";
import { useDispatch } from "react-redux";
import axios from "axios";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to store user and task data
  const [Data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-user-info", {
          headers: {
            id: localStorage.getItem("id"), // Send ID from localStorage
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("User Info:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem("id")) {
      fetchUserData();
    }
  }, []);

  // Logout function
  const logout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    navigate("/signup");
  };

  // Displaying user info
  const username = Data?.username || localStorage.getItem("username");
  const email = Data?.email || localStorage.getItem("email");

  const data = [
    { title: "All Tasks", icon: <CgNotes />, link: "/" },
    { title: "Important Tasks", icon: <MdLabelImportant />, link: "/importantTasks" },
    { title: "Completed Tasks", icon: <FaCheckDouble />, link: "/completedTasks" },
    { title: "Incompleted Tasks", icon: <TbNotebookOff />, link: "/incompletedTasks" },
  ];

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div
        className={`p-4 w-80 bg-white rounded-lg shadow-lg flex flex-col justify-between fixed top-0 left-0 h-full lg:w-80 lg:flex-col lg:static lg:h-auto transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden lg:block"
        }`}
      >
        {loading ? (
          <div className="p-3 mb-3 text-center text-gray-500">Loading user information...</div>
        ) : username && email ? (
          <div className="p-3 mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg text-center text-xs">
            <h2 className="text-lg font-semibold text-white">{username}</h2>
            <h4 className="text-xs text-gray-200">{email}</h4>
            <hr className="my-2 border-gray-500" />
          </div>
        ) : (
          <div className="p-3 mb-3 text-center text-gray-500">
            User information not available.
          </div>
        )}

        <div className="flex-grow">
          {data.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="my-3 flex items-center p-3 text-sm rounded bg-gradient-to-r from-gray-800 to-gray-600 text-white hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-500 transition-all duration-300"
            >
              {item.icon} &nbsp; {item.title}
            </Link>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="bg-gradient-to-r from-red-600 to-red-800 w-full p-3 rounded text-white hover:from-red-700 hover:to-red-900 transition duration-300 text-sm"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </div>

      <button
        className="lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Open"} Sidebar
      </button>
    </div>
  );
};

export default Sidebar;

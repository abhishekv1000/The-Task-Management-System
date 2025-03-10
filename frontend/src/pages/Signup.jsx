import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../apiurl";

const Signup = () => {
  const history = useNavigate();
  

  const [Data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false); 

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
      if (Data.username === "" || Data.email === "" || Data.password === "") {
        alert("All Fields are required!");
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/v1/sign-in`,
          Data
        );
        setData({ username: "", email: "", password: "" });
        history("/login");
      }
    } catch (error) {
      setError(error.response.data.message);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 4000);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 via-gray-900 to-black">
      <h1 className="text-4xl font-bold text-white mb-10">YOUR TASK MANAGER</h1>

     
      {showAlert && (
        <div
          className="fixed top-0 left-1/2 transform -translate-x-1/2 w-96 p-4 bg-red-600 text-white text-center font-semibold z-50 shadow-lg rounded-lg opacity-90 transition-all duration-500 ease-in-out"
          style={{
            top: showAlert ? "10px" : "-50px", 
            opacity: showAlert ? "1" : "0",
          }}
        >
          {error}
        </div>
      )}

      <div className="p-10 w-96 rounded-xl bg-white shadow-2xl">
        <div className="text-3xl font-semibold text-gray-800 text-center mb-8">Sign Up</div>
        
      
        <input
          autoComplete="off"
          type="text"
          placeholder="Username"
          name="username"
          className="bg-gray-100 text-gray-800 px-6 py-3 my-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out text-lg"
          onChange={change}
          value={Data.username}
        />
        <input
          autoComplete="off"
          type="email"
          placeholder="Email"
          name="email"
          className="bg-gray-100 text-gray-800 px-6 py-3 my-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out text-lg"
          onChange={change}
          value={Data.email}
        />
        <input
          autoComplete="off"
          type="password"
          placeholder="Password"
          name="password"
          className="bg-gray-100 text-gray-800 px-6 py-3 my-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out text-lg"
          onChange={change}
          value={Data.password}
        />

        <div className="w-full flex items-center justify-between mt-8">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold text-white px-8 py-3 rounded-lg transition duration-300 w-full"
            onClick={submit}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

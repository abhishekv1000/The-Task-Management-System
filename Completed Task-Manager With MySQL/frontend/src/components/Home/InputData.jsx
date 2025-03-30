import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const InputData = ({ inputDiv, setInputDiv, UpdatedData, setUpdatedData }) => {
  const [Data, setData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (UpdatedData) {
      setData({
        title: UpdatedData.title || "",
        description: UpdatedData.description || "", // Use 'description'
      });
    }
  }, [UpdatedData]);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submitData = async () => {
    if (Data.title === "" || Data.description === "") {
      alert("All fields are required");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:1000/api/v2/create-task",
          { title: Data.title, description: Data.description }, // Use 'description'
          { headers }
        );
        console.log("Submit Response:", response.data);
      } catch (error) {
        console.error("Error submitting data:", error.response?.data || error.message);
      }
      setData({ title: "", description: "" });
      setInputDiv("hidden");
      window.location.reload();
    }
  };

  const updateTask = async () => {
    if (Data.title === "" || Data.description === "") {
      alert("All fields are required");
    } else {
      try {
        const response = await axios.put(
          `http://localhost:1000/api/v2/update-task/${UpdatedData.id}`,
          { title: Data.title, description: Data.description }, // Use 'description'
          { headers }
        );
        console.log("Update Response:", response.data);
        setUpdatedData({ id: "", title: "", description: "" });
        setData({ title: "", description: "" });
        setInputDiv("hidden");
        window.location.reload();
      } catch (error) {
        console.error("Error updating task:", error.response?.data || error.message);
      }
    }
  };

  return (
    <>
      <div className={`${inputDiv} top-0 left-0 bg-gray-700 opacity-50 h-screen w-full fixed`}></div>
      <div className={`${inputDiv} top-0 left-0 flex items-center justify-center h-screen w-full fixed`}>
        <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg">
          <div className="flex justify-end">
            <button
              className="text-2xl text-white"
              onClick={() => {
                setInputDiv("hidden");
                setData({ title: "", description: "" });
                setUpdatedData({ id: "", title: "", description: "" });
              }}
            >
              <RxCross2 />
            </button>
          </div>
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="px-4 py-3 rounded-md w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={Data.title}
            onChange={change}
          />
          <textarea
            name="description"
            cols="30"
            rows="10"
            placeholder="Description..."
            className="px-4 py-3 rounded-md w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 my-4"
            value={Data.description}
            onChange={change}
          ></textarea>
          {UpdatedData.id === "" ? (
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md text-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition duration-300"
              onClick={submitData}
            >
              Submit
            </button>
          ) : (
            <button
              className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-md text-xl font-semibold hover:from-blue-600 hover:to-teal-600 transition duration-300"
              onClick={updateTask}
            >
              Update
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InputData;

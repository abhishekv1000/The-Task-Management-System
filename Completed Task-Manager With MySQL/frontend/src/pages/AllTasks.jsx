import React, { useEffect, useState } from "react";
import Cards from "../components/Home/Cards";
import { IoIosAddCircle } from "react-icons/io";
import InputData from "../components/Home/InputData";
import axios from "axios";

function AllTasks() {
  const [inputDiv, setInputDiv] = useState("hidden");
  const [Data, setData] = useState([]); // Task list state
  const [UpdatedData, setUpdatedData] = useState({
    id: "",
    title: "",
    desc: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for fetching tasks

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch tasks when the component is mounted
  useEffect(() => {
    const fetch = async () => {
      setLoading(true); // Set loading to true while fetching
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v2/get-all-tasks",
          { headers }
        );
        if (response.data && response.data.data) {
          setData(response.data.data); // Update state with fetched data
        } else {
          console.error("No data found in the response.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      fetch();
    }
  }, []); // Empty dependency array means this will run only once when the component mounts

  // Handle editing a task
  const handleEditTask = (task) => {
    console.log("Editing task:", task);  // Check if the task has id and other properties
    setUpdatedData({
      id: task.id, // Ensure the task ID is being set correctly
      title: task.title,
      desc: task.desc,
    });
    setInputDiv("fixed"); // Open the input form for editing
  };

  return (
    <>
      <div>
        {/* Add Task Button */}
        <div className="w-full flex justify-end px-4 py-2">
          <button
            onClick={() => setInputDiv("fixed")}
            className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-white to-white text-white p-4 rounded-full shadow-lg hover:bg-opacity-80 transition duration-300 transform hover:scale-110"
          >
            <IoIosAddCircle className="text-4xl" />
          </button>
        </div>

        {/* Loading state display */}
        {loading && <p className="text-center text-xl">Loading tasks...</p>}

        {/* Cards Display */}
        {!loading && Data && (
          <Cards
            home={"true"}
            setInputDiv={setInputDiv}
            data={Data}
            setUpdatedData={setUpdatedData}
            handleEditTask={handleEditTask} // Pass the handleEditTask function to Cards
          />
        )}
      </div>

      {/* Input Data Form (Modal) */}
      <InputData
        inputDiv={inputDiv}
        setInputDiv={setInputDiv}
        UpdatedData={UpdatedData}
        setUpdatedData={setUpdatedData}
        setTaskList={setData} // Pass setData function to InputData for immediate update
      />
    </>
  );
}

export default AllTasks;

import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";

const Cards = ({ home, setInputDiv, data, setUpdatedData }) => {
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleCompleteTask = async (event, id) => {
    event.preventDefault();
    try {
      if (!id) {
        console.error("Task ID is missing!");
        return;
      }
      await axios.put(
        `http://localhost:1000/api/v2/update-complete-task/${id}`,
        {},
        { headers }
      );
      console.log(`Task ${id} completion status updated.`);
    } catch (error) {
      console.error("Error in completing task:", error);
    }
    window.location.reload();
  };

  const handleImportantTask = async (event, id) => {
    event.preventDefault();
    try {
      if (!id) {
        console.error("Task ID is missing!");
        return;
      }
      await axios.put(
        `http://localhost:1000/api/v2/update-imp-task/${id}`,
        {},
        { headers }
      );
      console.log(`Task ${id} importance status updated.`);
    } catch (error) {
      console.error("Error in marking task as important:", error);
    }
    window.location.reload();
  };

  const handleUpdate = (id, title, description) => {
    setInputDiv("fixed");
    setUpdatedData({ id, title, description });
    console.log(`Task ${id} prepared for update.`);
  };

  const deleteTask = async (event, id) => {
    event.preventDefault();
    try {
      if (!id) {
        console.error("Task ID is missing!");
        return;
      }
      await axios.delete(`http://localhost:1000/api/v2/delete-task/${id}`, {
        headers,
      });
      console.log(`Task ${id} deleted.`);
    } catch (error) {
      console.error("Error in deleting task:", error);
    }
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data &&
        data.map((items, i) => (
          <div
            key={i}
            className="flex flex-col justify-between border border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <div>
              <h3 className="text-xl font-semibold text-white truncate">
                {items.title}
              </h3>
              <p className="text-gray-300 my-2 text-sm">{items.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap justify-between items-center">
              <button
                onClick={(e) => handleCompleteTask(e, items.id)}
                className={`${items.complete === false
                    ? "bg-gradient-to-r from-red-500 to-red-700"
                    : "bg-gradient-to-r from-green-500 to-green-700"
                  } px-4 py-2 rounded text-white text-sm transition duration-300 hover:bg-opacity-80 w-full sm:w-auto`}
              >
                {items.complete ? "Completed" : "Incomplete"}
              </button>
              <div className="text-white p-2 text-xl flex justify-around mt-2 sm:mt-0 w-full sm:w-auto">
                <button onClick={(e) => handleImportantTask(e, items.id)}>
                  <FaHeart
                    className={`text-xl ${items.important ? "text-red-500" : "text-white-500"}`}
                  />
                </button>

                {home !== "false" && (
                  <button onClick={() => handleUpdate(items.id, items.title, items.description)}>
                    <FaEdit />
                  </button>
                )}
                <button onClick={(e) => deleteTask(e, items.id)}>
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      {home === "true" && (
        <button
          onClick={() => setInputDiv("fixed")}
          className="flex flex-col justify-center items-center bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg p-6 shadow-md hover:scale-105 transition duration-300 w-full sm:w-auto"
        >
          <IoIosAddCircle className="text-5xl" />
          <h2 className="text-2xl mt-2">Add tasks</h2>
        </button>
      )}
    </div>
  );
};

export default Cards;

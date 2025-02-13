import React, { useEffect, useState } from "react";
import Cards from "../components/Home/Cards";
import { IoIosAddCircle } from "react-icons/io";
import InputData from "../components/Home/InputData";
import axios from "axios";
  import API_BASE_URL  from "../apiurl";

function AllTasks() {
  const [inputDiv, setInputDiv] = useState("hidden");
  const [Data, setData] = useState();
  const [UpdatedData, setUpdatedData] = useState({
    id: "",
    title: "",
    desc: "",
  });



  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        // Construct the full API endpoint using the base URL
        const response = await axios.get(
          `${API_BASE_URL}/v2/get-all-tasks`, // Append the endpoint to the base URL
          { headers }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (localStorage.getItem("id") && localStorage.getItem("token")) {
      fetch();
    }
  }, [headers]); // added `headers` as dependency to ensure it updates when localStorage changes

  return (
    <>
      <div>
        {/* Add Task Button */}
        <div className="w-full flex justify-end px-10 py-8">
          <button
            onClick={() => setInputDiv("fixed")}
            className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-white-800 to-white-700 text-white p-9 rounded-full shadow-lg hover:bg-opacity-80 transition duration-300"
          >
            <IoIosAddCircle className="text-4xl" />
          </button>
        </div>

        {/* Cards Display */}
        {Data && (
          <Cards
            home={"true"}
            setInputDiv={setInputDiv}
            data={Data.tasks}
            setUpdatedData={setUpdatedData}
          />
        )}
      </div>

      {/* Input Data Form (Modal) */}
      <InputData
        inputDiv={inputDiv}
        setInputDiv={setInputDiv}
        UpdatedData={UpdatedData}
        setUpdatedData={setUpdatedData}
      />
    </>
  );
}

export default AllTasks;

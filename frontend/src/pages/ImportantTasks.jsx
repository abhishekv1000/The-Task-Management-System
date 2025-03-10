import React, { useEffect, useState } from "react";
import Cards from "../components/Home/Cards";
import axios from "axios";
import API_BASE_URL from "../apiurl";

const ImportantTasks = () => {
  const [Data, setData] = useState();


  
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
       
        const response = await axios.get(
          `${API_BASE_URL}/v2/get-imp-tasks`,
          { headers }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetch();
  }, [headers]); 

  return (
    <div className="container mx-auto p-4">
      <br />
      <h1 className="text-2xl font-bold text-center my-4">Important Tasks</h1>
      <Cards home={"false"} data={Data} />
    </div>
  );
};

export default ImportantTasks;

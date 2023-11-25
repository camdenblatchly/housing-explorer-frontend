import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScatterPlot from './../components/ScatterPlot';

import ParentSize from '@visx/responsive/lib/components/ParentSize';

import style from "./style/Dashboard.module.css"

const Dashboard = () => {
  // State to store the response data
  const [responseData, setResponseData] = useState(null);

  // Function to make the API request
  const fetchData = async () => {
    try {
      console.log("fetching data?");
      // Replace 'your_api_endpoint' with the actual endpoint URL
      const response = await axios.get('http://127.0.0.1:5000/select_columns', {
        params: {
          dependent_variable: 'rent_burden',
          independent_variable: 'zri_st',
        },
      });

      // Set the response data in the state
      setResponseData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // UseEffect to make the API request when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means it runs once when the component mounts

  // Render your component with the fetched data
  return (
    <div className={style["dashboard"]}>
      {responseData && (
        <div className={style["chart-container"]}>
          <ParentSize>{({ width, height }) => <ScatterPlot width={width} height={height} data={responseData.data} />}</ParentSize>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
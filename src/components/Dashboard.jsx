import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ScatterPlot from './../components/ScatterPlot';

const Dashboard = () => {
  // State to store the response data
  const [responseData, setResponseData] = useState(null);

  // Function to make the API request
  const fetchData = async () => {
    try {
      // Replace 'your_api_endpoint' with the actual endpoint URL
      const response = await axios.get('https://a1xl4b9xbk.execute-api.us-east-1.amazonaws.com/select_columns', {
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
    <div>
      <h1>Your React Component</h1>
      {responseData && (
        <div>
          <h2>Response Data</h2>
          <ScatterPlot data = {responseData.data} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
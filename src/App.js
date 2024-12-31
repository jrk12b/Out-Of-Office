import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import HeaderNavigation from './components/HeaderNavigation';
import PageHeader from './components/PageHeader';
import PageContent from './components/PageContent';
import PTOCard from './components/PTOCard';
import PTOPlanned from './components/PTOPlannedCard';
import TotalPTOCard from './components/PTOTotalCard';
import PTORemainingCard from './components/PTORemainingCard';

const App = () => {
  const [activeYear, setActiveYear] = useState('2024');
  const [ptoList, setPtoList] = useState([]);
  const totalPTO = 18;

  // Fetch PTO items from the database
  useEffect(() => {
    const fetchPTO = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pto'); // Adjust URL if needed
        setPtoList(response.data);
      } catch (error) {
        console.error('Error fetching PTO data:', error);
      }
    };

    fetchPTO();
  }, []);

  const ptoPlanned = ptoList.length; // Count of planned PTOs
  const ptoRemaining = totalPTO - ptoPlanned; // Calculate remaining PTOs

  // Add a new PTO item
  const addPTO = async (newPTO) => {
    try {
      const response = await axios.post('http://localhost:8000/api/pto', newPTO);
      setPtoList((prev) => [...prev, response.data]); // Update state with new PTO
    } catch (error) {
      console.error('Error adding PTO:', error);
    }
  };

  // Delete a PTO item
  const deletePTO = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/pto/${id}`);
      setPtoList((prev) => prev.filter((pto) => pto._id !== id)); // Remove deleted PTO
    } catch (error) {
      console.error('Error deleting PTO:', error);
    }
  };

  return (
    <>
      {/* Navigation Menu */}
      <HeaderNavigation activeYear={activeYear} setActiveYear={setActiveYear} />

      {/* Header */}
      <PageHeader activeYear={activeYear} />

      {/* Page Content */}
      <PageContent activeYear={activeYear} />

      {/* PTO Section */}
      <div style={{ margin: '20px' }}>
        {/* PTO Card */}
        <PTOCard ptoList={ptoList} addPTO={addPTO} deletePTO={deletePTO} />

        {/* Cards Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '20px',
          }}
        >
          <PTOPlanned ptoCount={ptoPlanned} />
          <TotalPTOCard totalPTO={totalPTO} />
          <PTORemainingCard ptoRemaining={ptoRemaining} />
        </div>
      </div>
    </>
  );
};

export default App;

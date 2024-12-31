import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import HeaderNavigation from './components/HeaderNavigation';
import PageHeader from './components/PageHeader';
import PageContent from './components/PageContent';

const App = () => {
  const [activeYear, setActiveYear] = useState('2024');
  const [ptoList, setPtoList] = useState([]);
  const totalPTO = 18;

  useEffect(() => {
    const fetchPTO = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/pto');
        setPtoList(response.data);
      } catch (error) {
        console.error('Error fetching PTO data:', error);
      }
    };

    fetchPTO();
  }, []);

  const addPTO = async (newPTO) => {
    try {
      const response = await axios.post('http://localhost:8000/api/pto', newPTO);
      setPtoList((prev) => [...prev, response.data]);
    } catch (error) {
      console.error('Error adding PTO:', error);
    }
  };

  const deletePTO = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/pto/${id}`);
      setPtoList((prev) => prev.filter((pto) => pto._id !== id));
    } catch (error) {
      console.error('Error deleting PTO:', error);
    }
  };

  return (
    <>
      <HeaderNavigation activeYear={activeYear} setActiveYear={setActiveYear} />
      <PageHeader activeYear={activeYear} />
      <PageContent
        activeYear={activeYear}
        ptoList={ptoList}
        totalPTO={totalPTO}
        addPTO={addPTO}
        deletePTO={deletePTO}
      />
    </>
  );
};

export default App;

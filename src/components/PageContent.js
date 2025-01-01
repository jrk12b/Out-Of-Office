import React, { useState } from 'react';
import PTOPlannedCard from './PTOPlannedCard';
import TotalPTOCard from './PTOTotalCard';
import PTORemainingCard from './PTORemainingCard';
import PTOCard from './PTOCard';

const PageContent = ({ activeYear, ptoList, addPTO, deletePTO }) => {
  const [totalPTOByYear, setTotalPTOByYear] = useState({
    2023: 20,
    2024: 18,
  });

  // Update the total PTO for a specific year
  const updateTotalPTO = (activeYear, value) => {
    setTotalPTOByYear((prev) => ({
      ...prev,
      [activeYear]: value,
    }));
  };

  // Update an existing PTO entry
  const updatePTO = async (id, updatedPTO) => {
    try {
      const response = await fetch(`http://localhost:8000/api/pto/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPTO),
      });

      if (response.ok) {
        const updatedList = ptoList.map((pto) =>
          pto._id === id ? { ...pto, ...updatedPTO } : pto
        );

        // Update the PTO list with the new data
        setTotalPTOByYear(updatedList);
      } else {
        console.error('Failed to update PTO');
      }
    } catch (error) {
      console.error('Error updating PTO:', error);
    }
  };

  // Filter PTO list for the active year
  const filteredPTOList = ptoList.filter((pto) => pto.pto_year === activeYear);

  const totalPTO = totalPTOByYear[activeYear] || 0; // Default to 0 if no value exists for the year
  const ptoPlanned = filteredPTOList.length; // PTOs for the active year
  const ptoRemaining = totalPTO - ptoPlanned;

  return (
    <main style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
        }}
      >
        <TotalPTOCard
          activeYear={activeYear}
          totalPTO={totalPTO}
          updateTotalPTO={(value) => updateTotalPTO(activeYear, value)}
        />
        <PTOPlannedCard ptoCount={ptoPlanned} />
        <PTORemainingCard ptoRemaining={ptoRemaining} />
      </div>
      <PTOCard
        ptoList={filteredPTOList}
        addPTO={addPTO}
        deletePTO={deletePTO}
        updatePTO={updatePTO} // Pass the updatePTO function
      />
    </main>
  );
};

export default PageContent;

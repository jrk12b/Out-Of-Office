import React, { useState } from 'react';
import PTOPlannedCard from './PTOPlannedCard';
import TotalPTOCard from './PTOTotalCard';
import PTORemainingCard from './PTORemainingCard';
import PTOCard from './PTOCard';

const PageContent = ({ activeYear, ptoList, addPTO, deletePTO }) => {
  const [totalPTOByYear, setTotalPTOByYear] = useState({
    2023: 20,
    2024: 18,
  }); // Default PTO allotments by year

  // Update the total PTO for a specific year
  const updateTotalPTO = (year, value) => {
    setTotalPTOByYear((prev) => ({
      ...prev,
      [year]: value,
    }));
  };

  // Filter PTO list for the active year
  const filteredPTOList = ptoList.filter((pto) => pto.pto_year === activeYear);

  const totalPTO = totalPTOByYear[activeYear] || 0; // Default to 0 if no value exists for the year
  const ptoPlanned = filteredPTOList.length; // PTOs for the active year
  const ptoRemaining = totalPTO - ptoPlanned;

  return (
    <main style={{ padding: '20px' }}>
      <h3>{`Content for ${activeYear}`}</h3>
      <PTOCard ptoList={filteredPTOList} addPTO={addPTO} deletePTO={deletePTO} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px',
        }}
      >
        <PTOPlannedCard ptoCount={ptoPlanned} />
        <TotalPTOCard
          totalPTO={totalPTO}
          updateTotalPTO={(value) => updateTotalPTO(activeYear, value)}
        />
        <PTORemainingCard ptoRemaining={ptoRemaining} />
      </div>
    </main>
  );
};

export default PageContent;

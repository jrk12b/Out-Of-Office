import React from 'react';
import PTOPlannedCard from './PTOPlannedCard';
import TotalPTOCard from './PTOTotalCard';
import PTORemainingCard from './PTORemainingCard';
import PTOCard from './PTOCard';

const PageContent = ({ activeYear, ptoList, totalPTO, addPTO, deletePTO }) => {
  // Filter PTO list for the active year
  const filteredPTOList = ptoList.filter((pto) => pto.pto_year === activeYear);

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
        <TotalPTOCard totalPTO={totalPTO} />
        <PTORemainingCard ptoRemaining={ptoRemaining} />
      </div>
    </main>
  );
};

export default PageContent;

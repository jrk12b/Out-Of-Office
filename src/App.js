import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderNavigation from './components/HeaderNavigation';
import PageHeader from './components/PageHeader';
import PageContent from './components/PageContent';
import PTOCard from './components/PTOCard';
import PTOPlanned from './components/PTOPlannedCard';
import TotalPTOCard from './components/PTOTotalCard';
import PTORemainingCard from './components/PTORemainingCard';

const App = () => {
  const [activeYear, setActiveYear] = useState('2024');
  const [ptoList, setPtoList] = useState([
    { id: 1, name: 'Vacation', date: '2024-01-15' },
    { id: 2, name: 'Sick Leave', date: '2024-02-20' },
  ]);

  const totalPTO = 18; // Fixed total PTO days
  const ptoPlanned = ptoList.length;
  const ptoRemaining = totalPTO - ptoPlanned;

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
        <PTOCard ptoList={ptoList} setPtoList={setPtoList} />

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

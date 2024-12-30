import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderNavigation from './components/HeaderNavigation';
import PageHeader from './components/PageHeader';
import PageContent from './components/PageContent';

const App = () => {
  const [activeYear, setActiveYear] = useState('2024');

  return (
    <>
      {/* Navigation Menu */}
      <HeaderNavigation activeYear={activeYear} setActiveYear={setActiveYear} />

      {/* Header */}
      <PageHeader activeYear={activeYear} />

      {/* Main Content */}
      <PageContent activeYear={activeYear} />
    </>
  );
};

export default App;

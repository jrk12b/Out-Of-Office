import React from 'react';

const PageContent = ({ activeYear }) => {
  const contentByYear = {
    '2024': 'This is the content for 2024.',
    '2023': 'This is the content for 2023.',
    '2022': 'This is the content for 2022.',
  };

  return (
    <main style={{ padding: '20px' }}>
      <p>{contentByYear[activeYear]}</p>
    </main>
  );
};

export default PageContent;

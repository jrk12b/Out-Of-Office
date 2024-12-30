import React from 'react';

const PageHeader = ({ activeYear }) => {
  return (
    <header style={{ textAlign: 'center', margin: '20px 0' }}>
      <h1>Welcome to Out Of Office</h1>
      <p>Currently viewing content for the year: {activeYear}</p>
    </header>
  );
};

export default PageHeader;

import React from 'react';

export default function Page() {
  return (
    <div style={{margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '20px' }}>Dashboard Page</h2>
      <p>Welcome to the Ceramic Network Demo Dashboard. Here are the steps you can follow:</p>
      <div style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
        <p style={{ marginBottom: '10px' }}>• Authenticate yourself on the Ceramic Network.</p>
        <p style={{ marginBottom: '10px' }}>• Add assets based on the provided template.</p>
        <p style={{ marginBottom: '10px' }}>• View all the fetched assets stored on the Ceramic Network.</p>
        <p style={{ marginBottom: '10px' }}>• Attest to the data models that you store on the Ceramic Network.</p>
      </div>
    </div>
  );
}

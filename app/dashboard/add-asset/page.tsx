// app/dashboard/add-asset/page.tsx
'use client';

import React, { useState } from 'react';
import { useCeramicContext } from '@root/context/CeramicContext';

export default function AddAssetPage() {
  const clients = useCeramicContext();
  const {ceramic, composeClient} = clients; 

  const [jsonInput, setJsonInput] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          setJsonInput(e.target.result);
        } else {
          alert('Failed to load the file as text');
        }
      };
      reader.readAsText(file);
    } else {
      alert('No file selected or file access was denied.');
    }
  };

  const addEVPAsset = async () => {

    let jsonData;

    try {
      jsonData = JSON.parse(jsonInput);
    } catch (error) {
      alert('Invalid JSON format');
      return;
    }

    console.log('Sending request to /api/ceramic/add-asset with data:', jsonData);
    const response = await fetch('/api/ceramic/add-asset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData),
    });

    const result = await response.json();
    console.log('Response from API:', result);

    if (result.success) {
      alert('Audit Report added successfully');
    } else {
      alert('Failed to add audit report:\nError - ' + result.message);
    }
  };

  return (
    <div>
      <h1>Add Audit Report</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here or upload a file below."
        style={{ width: '300px', height: '200px' }}
      />
      <div>
        <input type="file" onChange={handleFileUpload} accept=".json" />
      </div>
      <button onClick={addEVPAsset}>Submit EVP Report</button>
    </div>
  );
}

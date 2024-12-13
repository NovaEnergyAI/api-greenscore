'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BatchProcessPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBatchProcess = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:10000/api/ceramic/batch-historic-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Batch processing completed successfully!');
      } else {
        toast.error(`Failed to complete batch processing: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during batch processing:', error);
      toast.error('An error occurred during batch processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Batch Process Historic Data</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        Click "Start Batch Process" to begin processing historic data.
      </p>
      <button
        onClick={handleBatchProcess}
        disabled={isProcessing}
        style={{
          padding: '8px 16px',
          background: isProcessing ? '#d3d3d3' : '#000',
          color: '#fff',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
        }}
      >
        {isProcessing ? 'Processing...' : 'Start Batch Process'}
      </button>
    </div>
  );
}

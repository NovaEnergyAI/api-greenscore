'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateEVPStreamPage() {
  const [documentId, setDocumentId] = useState('');
  const [streamData, setStreamData] = useState<any | null>(null);
 
  const sendToCeramic = async () => {
    if (!documentId) {
      toast.error('Please enter a document ID.');
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/ceramic/create-evp-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: documentId }),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      if (result.success) {
        setStreamData(result.streamDataResult);
        toast.success('Data saved to Ceramic successfully!');
      } else {
        toast.error(`Failed to save data: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending data to Ceramic:', error);
      toast.error('An error occurred while sending data to Ceramic.');
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Create EVP Report Stream on Ceramic</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        Enter the Document ID below and click "Create on Ceramic" to send your data.
      </p>
      <input
        type="text"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        placeholder="Enter Document ID"
        style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
      />
      <button 
        onClick={sendToCeramic} 
        style={{ padding: '8px 16px', background: '#000', color: '#fff' }}>
        Create on Ceramic
      </button>

      {streamData && (
        <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
          <h3>Stream Data Result</h3>
          <p><strong>Stream ID:</strong> {streamData.streamId}</p>
          <pre style={{ background: '#f8f8f8', padding: '10px', marginTop: '15px' }}>
            {JSON.stringify(streamData.state, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

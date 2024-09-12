'use client';

import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FetchStreamPage = () => {
  const [streamId, setStreamId] = useState('');
  const [streamData, setStreamData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStream = async () => {
    if (!streamId) {
      setError('Please enter a Stream ID');
      toast.error('Please enter a Stream ID');
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/ceramic/fetch-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ streamId }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Response from API - (fetch-stream.ts)', result);

        if (result.success && result.data) {
          setStreamData(result.data);
          toast.success('Stream fetched successfully!');
        } else {
          setError('No data returned for the provided Stream ID');
          toast.error('No data returned');
        }
      } else {
        setError('Failed to fetch the stream');
        toast.error('Failed to fetch the stream');
      }
    } catch (err) {
      setError('Error fetching data');
      toast.error('Error fetching data');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Fetch EVP Stream from Ceramic</h1>
      <input
        type="text"
        value={streamId}
        onChange={(e) => setStreamId(e.target.value)}
        placeholder="Enter Stream ID"
        style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
      />
      <button onClick={fetchStream} style={{ padding: '8px 16px', marginLeft: '10px' }}>
        Fetch Stream
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {streamData && (
        <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
          <h2>Stream Data Result</h2>
          <pre style={{ background: '#f8f8f8', padding: '10px', overflowX: 'auto' }}>
            {JSON.stringify(streamData.state, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FetchStreamPage;

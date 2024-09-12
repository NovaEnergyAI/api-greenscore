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
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Fetch EVP Stream from Ceramic</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        To fetch an EVP stream, enter the Stream ID below and click "Fetch Stream".
      </p>
      <input
        type="text"
        value={streamId}
        onChange={(e) => setStreamId(e.target.value)}
        placeholder="Enter Stream ID"
        style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
      />
      <button
        onClick={fetchStream}
        style={{ padding: '8px 16px', marginLeft: '10px', background: '#000', color: '#fff' }}>
        Fetch Stream
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {streamData && (
        <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
          <h3>Stream Data Result</h3>
          <p style={{ marginTop: '10px' }}><strong>Stream ID:</strong> {streamData.streamId}</p>
          <p><strong>EVP ID:</strong> {streamData.state.content.evpId}</p>
          <p><strong>Entity Company:</strong> {streamData.state.content.greenscoreDB?.entityCompany || 'N/A'}</p>
          <p><strong>Green Score:</strong> {streamData.state.content.greenscoreDB?.greenScore !== undefined ? streamData.state.content.greenscoreDB.greenScore : 'N/A'}</p>
          <pre style={{ background: '#f8f8f8', padding: '10px', marginTop: '15px', overflowX: 'auto' }}>
            {JSON.stringify(streamData.state, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FetchStreamPage;

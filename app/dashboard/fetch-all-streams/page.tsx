'use client';

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EVPNode {
  streamId: string;
  evpId: string;
  evpReportDB?: {
    entityCompany?: string;
  };
  greenscoreDB?: {
    greenScore?: number;
  };
}

const FetchAllStreamsPage = () => {
  const [evpOutputs, setEVPOutputs] = useState<EVPNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:10000/api/ceramic/fetch-all-streams');
     
      if (response.ok) {
        const result = await response.json();
        console.log('Response from API - (fetch-all-streams.ts):', result);

        if (result.success && result.data) {
          // Extracting only a few fields not all:
          const formattedData = result.data.map((node: any) => ({
            streamId: node.streamId,
            evpId: node.state.content.evpId,
            evpReportDB: {
              entityCompany: node.state.content.evpReportDB?.entityCompany,
            },
            greenscoreDB: {
              greenScore: node.state.content.greenscoreDB?.greenScore,
            },
          }));
          setEVPOutputs(formattedData);
          
          // Checks if the success toast is already active before showing it
          if (!toast.isActive('fetch-success')) {
            toast.success('Data fetched successfully!', { toastId: 'fetch-success' });
          }
        } else {
          setError('No data returned');
          toast.error('No data returned');
        }
      } else {
        setError('Failed to fetch EVP outputs');
        toast.error('Failed to fetch EVP outputs');
      }
    } catch (err) {
      setError('Error fetching data');
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h2>Fetches All EVPs from Ceramic</h2>
      {error && <p>{error}</p>}
      <ul>
        {evpOutputs.map((node, index) => (
          <li key={index} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            <p><strong>Stream ID:</strong> {node.streamId}</p>
            <p><strong>EVP ID:</strong> {node.evpId}</p>
            <p><strong>Entity Company:</strong> {node.evpReportDB?.entityCompany || 'N/A'}</p>
            <p><strong>Green Score:</strong> {node.greenscoreDB?.greenScore !== undefined ? node.greenscoreDB.greenScore : 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchAllStreamsPage;

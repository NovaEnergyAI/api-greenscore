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
  state: any; // Added to ensure full stream state is accessible
}

const FetchAllStreamsPage = () => {
  const [evpOutputs, setEVPOutputs] = useState<EVPNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:10000/api/ceramic/fetch-all-streams');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const formattedData = result.data.map((node: any) => ({
            streamId: node.streamId,
            evpReportDB: {
              entityCompany: node.state.content.evpReportDB?.entityCompany,
            },
            greenscoreDB: {
              greenScore: node.state.content.greenscoreDB?.greenScore,
            },
            state: node.state, // Keep the full state for modal display
          }));
          setEVPOutputs(formattedData);
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

  const openModal = (stream: any) => {
    setSelectedStream(stream);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStream(null);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Fetch All EVP Streams from Ceramic</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        Below are all fetched EVP streams from the Ceramic network. Click "View Stream" to browse complete stream details.
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {evpOutputs.map((node, index) => (
          <li key={index} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <p><strong>Stream ID:</strong> {node.streamId}</p>
              {/* <p><strong>EVP ID:</strong> {node.evpId}</p> */}
              <p><strong>Entity Company:</strong> {node.evpReportDB?.entityCompany || 'N/A'}</p>
              <p><strong>Green Score:</strong> {node.greenscoreDB?.greenScore !== undefined ? node.greenscoreDB.greenScore : 'N/A'}</p>
            </div>
            <button
              onClick={() => openModal(node)}
              style={{
                padding: '8px 16px',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
            >
              View Stream
            </button>
          </li>
        ))}
      </ul>

      {showModal && selectedStream && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '80%',
            maxHeight: '80%',
            overflowY: 'auto',
            position: 'relative',
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: '#f00', 
                color: '#fff',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: '1',
              }}
            >
              x
            </button>
            <h3>The EVP Stream Output</h3>
            <pre style={{ background: '#f8f8f8', padding: '10px', overflowX: 'auto'}}>
              {JSON.stringify(selectedStream.state, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FetchAllStreamsPage;

'use client';

import React, { useState, useEffect } from 'react';
import { authenticateCeramic } from '@root/scripts/authenticate';
import { useCeramicContext } from '@root/context/CeramicContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BatchProcessPage() {
  const [session, setSession] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedSession = localStorage.getItem('ceramic:eth_did');
        if (storedSession) {
          setSession(storedSession);
          setIsAuthenticated(true);
          console.log('Session restored from localStorage:', storedSession);
          toast.info('Session restored from localStorage.');
        } else {
          console.warn('No stored session found. Please authenticate.');
          setIsAuthenticated(false);
          toast.warn('No stored session found. Please authenticate.');
        }
      } catch (error) {
        console.error('Failed to authenticate:', error);
        setIsAuthenticated(false);
        toast.error('Failed to authenticate. Please try again.');
      }
    };

    initializeSession();
  }, [ceramic, composeClient]);

  const handleAuthenticate = async () => {
    try {
      localStorage.setItem('ceramic:auth_type', 'eth');
      await authenticateCeramic(ceramic, composeClient);
      const newSession = localStorage.getItem('ceramic:eth_did');
      if (newSession) {
        setSession(newSession);
        setIsAuthenticated(true);
        toast.success('Successfully authenticated with Ceramic!');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Authentication failed. Please try again.');
    }
  };

  const handleBatchProcess = async () => {
    if (!session) {
      toast.error('Session is not available. Please authenticate first.');
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/ceramic/batch-historic-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session }),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      if (result.success) {
        toast.success('Batch processing completed successfully!');
      } else {
        toast.error(`Failed to complete batch processing: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during batch processing:', error);
      toast.error('An error occurred during batch processing.');
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Batch Process Historic Data</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        {isAuthenticated
          ? 'Click "Start Batch Process" to begin processing historic data.'
          : 'Please authenticate to proceed with batch processing. Click "Authenticate with Ethereum DID PKH" to continue.'}
      </p>
      {isAuthenticated ? (
        <button
          onClick={handleBatchProcess}
          style={{ padding: '8px 16px', background: '#000', color: '#fff' }}
        >
          Start Batch Process
        </button>
      ) : (
        <div>
          <button onClick={handleAuthenticate} style={{ padding: '8px 16px', marginTop: '10px' }}>
            Authenticate with Ethereum DID PKH
          </button>
        </div>
      )}
    </div>
  );
}

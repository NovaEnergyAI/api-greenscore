'use client';

import React, { useState, useEffect } from 'react';
import { authenticateCeramic } from '@root/scripts/authenticate';
import { useCeramicContext } from '@root/context/CeramicContext';

export default function Page() {
  const [documentId, setDocumentId] = useState('');
  const [session, setSession] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [streamData, setStreamData] = useState<any | null>(null);
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
        } else {
          console.warn('No stored session found. Please authenticate.');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Failed to authenticate:', error);
        setIsAuthenticated(false);
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
      }
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const sendToCeramic = async () => {
    if (!session) {
      alert('Session is not available. Please authenticate first.');
      return;
    }

    if (!documentId) {
      alert('Please enter a document ID.');
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/ceramic/send-to-ceramic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: documentId, session }),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      if (result.success) {
        setStreamData(result.streamDataResult);
        alert('Data saved to Ceramic and Postgres successfully');
      } else {
        alert('Failed to save data:\nError - ' + result.message);
      }
    } catch (error) {
      console.error('Error sending data to Ceramic:', error);
      alert('An error occurred while sending data to Ceramic.');
    }
  };

  return (
    <div>
      <h1>Send Document to Ceramic</h1>
      {isAuthenticated ? (
        <>
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Enter Document ID"
          />
          <button onClick={sendToCeramic}>Submit Document to Ceramic</button>

          {streamData && (
            <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
              <h2>Stream Data Result</h2>
              <p><strong>Stream ID:</strong> <a href={`https://cerscan.com/testnet-clay/stream/${streamData.streamId}`} target="_blank" rel="noopener noreferrer">{streamData.streamId}</a></p>
              <p><strong>EVP ID:</strong> {streamData.state.content.evpId}</p>
              <p><strong>Entity Company:</strong> {streamData.state.content.evpReportDB?.entityCompany || 'N/A'}</p>
              <p><strong>Green Score:</strong> {streamData.state.content.greenscoreDB?.greenScore !== undefined ? streamData.state.content.greenscoreDB.greenScore : 'N/A'}</p>
              <p><strong>Provider City:</strong> {streamData.state.content.greenscoreDB?.providerCity || 'N/A'}</p>
              <pre style={{ background: '#f8f8f8', padding: '10px' }}>
                {JSON.stringify(streamData.state, null, 2)}
              </pre>
            </div>
          )}
        </>
      ) : (
        <div>
          <p>Please authenticate to proceed with adding assets.</p>
          <button onClick={handleAuthenticate}>
            Authenticate with Ethereum DID PKH
          </button>
        </div>
      )}
    </div>
  );
}

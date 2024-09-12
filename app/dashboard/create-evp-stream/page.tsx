'use client';

import React, { useState, useEffect } from 'react';
import { authenticateCeramic } from '@root/scripts/authenticate';
import { useCeramicContext } from '@root/context/CeramicContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateEVPStreamPage() {
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

  const sendToCeramic = async () => {
    if (!session) {
      toast.error('Session is not available. Please authenticate first.');
      return;
    }

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
        body: JSON.stringify({ document_id: documentId, session }),
      });

      const result = await response.json();
      console.log('Response from API:', result);

      if (result.success) {
        setStreamData(result.streamDataResult);
        toast.success('Data saved to Ceramic and Postgres successfully!');
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
      <h2>Send Document to Ceramic</h2>
      <p style={{ paddingTop: '10px', marginBottom: '10px' }}>
        {isAuthenticated
          ? 'Enter the Document ID below and click "Submit Document to Ceramic" to send your data.'
          : 'Please authenticate to proceed with adding assets. Click "Authenticate with Ethereum DID PKH" to continue.'}
      </p>
      {isAuthenticated ? (
        <>
          <input
            type="text"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
            placeholder="Enter Document ID"
            style={{ padding: '8px', marginBottom: '10px', width: '300px' }}
          />
          <button 
            onClick={sendToCeramic} 
            style={{ padding: '8px 16px', marginLeft: '10px', background: '#000', color: '#fff'}}>
            Submit Document to Ceramic
          </button>
        </>
      ) : (
        <div>
          <button onClick={handleAuthenticate} style={{ padding: '8px 16px', marginTop: '10px' }}>
            Authenticate with Ethereum DID PKH
          </button>
        </div>
      )}

      {streamData && (
        <div style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
          <h3>Stream Data Result</h3>
          <p><strong>Stream ID:</strong> {streamData.streamId}</p>
          <p><strong>EVP ID:</strong> {streamData.state.content.evpId}</p>
          <p><strong>Entity Company:</strong> {streamData.state.content.evpReportDB?.entityCompany || 'N/A'}</p>
          <p><strong>Green Score:</strong> {streamData.state.content.greenscoreDB?.greenScore !== undefined ? streamData.state.content.greenscoreDB.greenScore : 'N/A'}</p>
          <p><strong>Provider City:</strong> {streamData.state.content.greenscoreDB?.providerCity || 'N/A'}</p>
          <pre style={{ background: '#f8f8f8', padding: '10px' }}>
            {JSON.stringify(streamData.state, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { authenticateCeramic } from '@root/scripts/authenticate';
import { useCeramicContext } from '@root/context/CeramicContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthPrompt = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authButtonText, setAuthButtonText] = useState('Authenticate');
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  useEffect(() => {
    // Check if the user is already logged in and update the state accordingly
    if (localStorage.getItem('logged_in') === 'true') {
      setIsAuthenticated(true);
      setAuthButtonText('Authenticated');
    }
  }, []);

  const handleEthPkh = async () => {
    try {
      localStorage.setItem('ceramic:auth_type', 'eth');
      await authenticateCeramic(ceramic, composeClient);
      setIsAuthenticated(true);
      setAuthButtonText('Authenticated');
      localStorage.setItem('logged_in', 'true'); // Mark as logged in
      if (!toast.isActive('auth-success')) {
        toast.success('Successfully authenticated with Ethereum DID PKH!', { toastId: 'auth-success' });
      }
    } catch (error) {
      console.error('Ethereum DID PKH Authentication failed:', error);
      if (!toast.isActive('auth-fail')) {
        toast.error('Authentication failed. Please try again.', { toastId: 'auth-fail' });
      }
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('ceramic:eth_did');
    localStorage.removeItem('ceramic:auth_type');
    localStorage.removeItem('logged_in');
    setIsAuthenticated(false);
    setAuthButtonText('Authenticate');
    if (!toast.isActive('clear-storage')) {
      toast.info('Local storage cleared. You may need to re-authenticate.', { toastId: 'clear-storage' });
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <ToastContainer />
      <h2>Authenticate</h2>
      {isAuthenticated ? (
        <p style={{ paddingTop: '10px' }}>
           You're now authenticated. If you want to re-authorize your session, click the "Clear Storage" button below.
        </p>
      ) : (
        <p style={{ paddingTop: '10px' }}>
          Please authenticate to use this service. Click the "Ethereum DID PKH" button to login with your wallet 
          (in simpler terms: login with MetaMask).
        </p>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexDirection: 'column', maxWidth: '200px' }}>
        {/* Authenticate Button */}
        <button
          onClick={handleEthPkh}
          style={{
            padding: '10px',
            background: isAuthenticated ? '#d3d3d3' : '#000', // Grayed out when disabled
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: isAuthenticated ? 'not-allowed' : 'pointer',
            opacity: isAuthenticated ? 1 : 1,
            pointerEvents: isAuthenticated ? 'none' : 'auto',
          }}
          disabled={isAuthenticated}
        >
          {authButtonText}
        </button>

        {/* Clear Storage Button */}
        <button
          onClick={clearLocalStorage}
          style={{
            padding: '10px',
            background: isAuthenticated ? '#f00' : '#d3d3d3', // Grayed out when disabled
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            opacity: isAuthenticated ? 1 : 1,
            pointerEvents: isAuthenticated ? 'auto' : 'none',
          }}
          disabled={!isAuthenticated}
        >
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default AuthPrompt;

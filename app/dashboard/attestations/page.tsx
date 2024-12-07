'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EAS_BASE_SEPOLIA_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021'; // Base Sepolia EAS contract address
const BASE_SEPOLIA_SCHEMA_UID = '0x7345713374a82b7b2281d6f8bc43e044b41f633e336e32280e54501f7edeedf9'; // Schema UID
const BASE_SEPOLIA_CHAIN_ID = 84532; // Base Sepolia Chain ID
const BASE_SEPOLIA_EAS_SCAN_URL = 'https://base-sepolia.easscan.org/attestation/view/'; // EAS Scan Link

const AttestationPage = () => {
  const [ceramic_id, setCeramicId] = useState('');
  const [attestationUID, setAttestationUID] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [signer, setSigner] = useState<ethers.Signer | undefined>(undefined);
  const [userAddress, setUserAddress] = useState<string>('');

  useEffect(() => {
    const initializeSession = async () => {
      if (localStorage.getItem('wallet_connected') !== 'true') {
        await connectWallet();
      }
    };
    initializeSession();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const newProvider = new ethers.BrowserProvider(window.ethereum);
        await newProvider.send('eth_requestAccounts', []);
        const newSigner = await newProvider.getSigner();
        const signerAddress = await newSigner.getAddress();

        const network = await newProvider.getNetwork();
        if (network.chainId !== BigInt(BASE_SEPOLIA_CHAIN_ID)) {
          throw new Error(`Please ensure your wallet is connected to the Base Sepolia network (chainId: ${BASE_SEPOLIA_CHAIN_ID}).`);
        }

        setProvider(newProvider);
        setSigner(newSigner);
        setUserAddress(signerAddress);

        setIsAuthenticated(true);
        localStorage.setItem('wallet_connected', 'true');
        toast.success('Wallet connected successfully!');
      } catch (err) {
        console.error('Error connecting wallet:', err);
        toast.error('Error connecting wallet. Please ensure you are on Base Sepolia.');
      }
    } else {
      toast.error('Please install MetaMask');
    }
  };

  const handleFetchAndCreateAttestation = async () => {
    if (!ceramic_id) {
      toast.error('Please enter a Ceramic ID.');
      return;
    }

    if (!isAuthenticated) {
      toast.error('No wallet connected. Please authenticate first.');
      return;
    }

    if (!signer) {
      toast.error('No wallet connected');
      return;
    }

    try {
      const response = await fetch('http://localhost:10000/api/ethereum-attestations/prepare-attestation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ceramic_id }),
      });

      const result = await response.json();
      if (!result.success) {
        toast.error(`Failed to fetch attestation data: ${result.message}`);
        return;
      }

      const evpData = result.attestationPackage;
      const eas = new EAS(EAS_BASE_SEPOLIA_CONTRACT_ADDRESS);
      eas.connect(signer);

      toast.info('Creating on-chain attestation...');

      const schemaEncoder = new SchemaEncoder(
        'string ceramicStreamId,string modelCID,string rootCID,string confidenceScore,string emissionsScore,string greenScore,string locationScore,string providerNetwork,string providerCountry,string entityCompany,string reportStartDate,string reportEndDate'
      );

      const encodedData = schemaEncoder.encodeData([
        { name: 'ceramicStreamId', value: evpData.ceramicStreamId, type: 'string' },
        { name: 'modelCID', value: evpData.modelCID, type: 'string' },
        { name: 'rootCID', value: evpData.rootCID, type: 'string' },
        { name: 'confidenceScore', value: evpData.confidenceScore, type: 'string' },
        { name: 'emissionsScore', value: evpData.emissionsScore, type: 'string' },
        { name: 'greenScore', value: evpData.greenScore, type: 'string' },
        { name: 'locationScore', value: evpData.locationScore, type: 'string' },
        { name: 'providerNetwork', value: evpData.providerNetwork, type: 'string' },
        { name: 'providerCountry', value: evpData.providerCountry, type: 'string' },
        { name: 'entityCompany', value: evpData.entityCompany, type: 'string' },
        { name: 'reportStartDate', value: evpData.reportStartDate, type: 'string' },
        { name: 'reportEndDate', value: evpData.reportEndDate, type: 'string' },
      ]);

      const tx = await eas.attest({
        schema: BASE_SEPOLIA_SCHEMA_UID,
        data: {
          recipient: userAddress,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      setAttestationUID(newAttestationUID);
      toast.success('On-chain attestation created successfully!');
    } catch (error) {
      console.error('Error creating on-chain attestation:', error);
      toast.error('Error creating on-chain attestation.');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '20px auto', maxWidth: '600px', color: '#333' }}>
      <ToastContainer />
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', color: '#222' }}>Attestation Management</h1>
        <p style={{ fontSize: '14px', color: '#555' }}>Manage your attestations on Base Sepolia</p>
      </header>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Connect Wallet</h3>
        <button
          onClick={connectWallet}
          style={{
            width: '100%',
            padding: '12px',
            background: isAuthenticated ? '#4caf50' : '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isAuthenticated ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '10px' }}>Enter Ceramic ID</h3>
        <input
          type="text"
          value={ceramic_id}
          onChange={(e) => setCeramicId(e.target.value)}
          placeholder="Enter Ceramic ID"
          style={{
            width: 'calc(100% - 20px)',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={handleFetchAndCreateAttestation}
          style={{
            width: '100%',
            padding: '10px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Fetch & Create Attestation
        </button>
      </section>

      {attestationUID && (
        <section style={{ marginTop: '20px', padding: '10px', background: '#e8f5e9', borderRadius: '5px' }}>
          <h4 style={{ marginBottom: '10px' }}>New Attestation UID:</h4>
          <p style={{ wordBreak: 'break-all', color: '#2e7d32' }}>{attestationUID}</p>
          <a
            href={`${BASE_SEPOLIA_EAS_SCAN_URL}${attestationUID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#007bff',
              textDecoration: 'underline',
              fontSize: '14px',
              marginTop: '10px',
              display: 'block',
            }}
          >
            View Attestation on EAS Scan
          </a>
        </section>
      )}
    </div>
  );
};

export default AttestationPage;

'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { toast, ToastContainer } from 'react-toastify';
import { getEnvVariable } from '@root/common/utilities';
import 'react-toastify/dist/ReactToastify.css';
import 'dotenv';

const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021'; // Base Sepolia EAS contract address
const SCHEMA_UID = '0x7345713374a82b7b2281d6f8bc43e044b41f633e336e32280e54501f7edeedf9'; // Your schema UID
const BASE_SEPOLIA_CHAIN_ID = '84532'; // Base Sepolia Chain ID (Decimal)
const BASE_SEPOLIA_EAS_SCAN_URL = "https://base-sepolia.easscan.org/attestation/view/";

const AttestationPage = () => {
  const [ceramic_id, setCeramicId] = useState('');
  const [evpData, setEvpData] = useState<any>(null);
  const [attestationUID, setAttestationUID] = useState<string | null>(null);
  const [attestationDetails, setAttestationDetails] = useState<any>(null);
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
    console.log('Attempting to connect wallet...');
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
        console.log('Wallet connected:', signerAddress);
      } catch (err) {
        console.error('Error connecting wallet:', err);
        toast.error('Error connecting wallet. Please ensure you are on Base Sepolia.');
      }
    } else {
      toast.error('Please install MetaMask');
    }
  };

  const createOnchainAttestation = async () => {
    if (!ceramic_id) {
      toast.error('Please enter a Ceramic ID.');
      return;
    }

    try {
      // Fetch and prepare attestation data
      const response = await fetch('http://localhost:10000/api/ethereum-attestations/prepare-attestation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ceramic_id }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(`Failed to fetch attestation data: ${result.message}`);
        return;
      }

      const evpData = result.attestationPackage;
      setEvpData(evpData);

      // Create on-chain attestation
      toast.info('Creating on-chain attestation...');
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(signer!);

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
        schema: SCHEMA_UID,
        data: {
          recipient: userAddress,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();
      toast.success('On-chain attestation created successfully!');
      setAttestationUID(newAttestationUID);

      // Update database with new UID
      const updateResponse = await fetch('http://localhost:10000/api/ethereum-attestations/update-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ceramic_id, ethereum_attestation_uid: newAttestationUID }),
      });

      const updateResult = await updateResponse.json();
      if (updateResult.success) {
        toast.success('Database updated successfully!');
      } else {
        toast.error(`Failed to update database: ${updateResult.message}`);
      }

      // Fetch attestation details
      fetchAttestationDetails(newAttestationUID);
    } catch (error) {
      console.error('Error during attestation process:', error);
      toast.error('An error occurred during the attestation process.');
    }
  };

  const fetchAttestationDetails = async (uid: string) => {
    if (!uid) {
      toast.error('UID is required to fetch attestation details.');
      return;
    }
  
    try {
      console.log('Fetching attestation details for UID:', uid);
  
      // Ensure provider and signer are available
      if (!provider || !signer) {
        toast.error('Please connect your wallet first.');
        return;
      }
  
      // Initialize EAS using the existing provider
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(provider);
  
      // Fetch attestation details
      const attestation = await eas.getAttestation(uid);
  
      if (attestation) {
        setAttestationDetails(attestation);
        toast.success('Attestation details fetched successfully!');
        console.log('Fetched Attestation:', attestation);
      } else {
        toast.error('No attestation found for the given UID.');
      }
    } catch (error) {
      console.error('Error fetching attestation details:', error);
      toast.error('Failed to fetch attestation details. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'left', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Attestation Management</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Connect Wallet</h3>
        <button
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {isAuthenticated ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Enter Ceramic ID</h3>
        <input
          type="text"
          value={ceramic_id}
          onChange={(e) => setCeramicId(e.target.value)}
          placeholder="Enter Ceramic ID"
          style={{
            padding: '10px',
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <button
        onClick={createOnchainAttestation}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Create On-chain Attestation
      </button>

      {attestationUID && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
          <h4>New Attestation UID:</h4>
          <p>{attestationUID}</p>
          <a
            href={`${BASE_SEPOLIA_EAS_SCAN_URL}${attestationUID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#007BFF', textDecoration: 'underline' }}
          >
            View Attestation on EAS Scan
          </a>
        </div>
      )}

      {attestationDetails && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            overflow: 'auto', // Makes the content scrollable if it overflows
            maxHeight: '300px', // Limits the height of the box
            wordWrap: 'break-word', // Ensures text wraps within the box
            whiteSpace: 'pre-wrap', // Preserves whitespace and line breaks
          }}
        >
          <h4>Attestation Details:</h4>
          <pre>
            {JSON.stringify(attestationDetails, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            , 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AttestationPage;

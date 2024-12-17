'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'dotenv';

const EAS_CONTRACT_ADDRESS = '0x4200000000000000000000000000000000000021';                  // Base Sepolia EAS contract address
const SCHEMA_UID = '0x3993cd39c764d865099102d18984a5df65e8739adc5b17fbf2aad96e1d8a1a7b';    // Our schema UID
const BASE_SEPOLIA_CHAIN_ID = 84532;                                                // Base Sepolia Chain ID (Decimal)
const BASE_SEPOLIA_EAS_SCAN_URL = "https://base-sepolia.easscan.org/attestation/view/";     // Base EAS Scan URL

const AttestationPage = () => {
  const [ceramicId, setCeramicId] = useState('');
  const [evpData, setEvpData] = useState<any>(null);
  const [attestationUID, setAttestationUID] = useState<string | null>(null);
  const [attestationDetails, setAttestationDetails] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | undefined>(undefined);
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
    try {
      if (!window.ethereum) throw new Error('MetaMask is not installed.');

      const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const signerInstance = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();

      if (network.chainId !== BASE_SEPOLIA_CHAIN_ID) {
        throw new Error(`Please connect to the Base Sepolia network (chainId: ${BASE_SEPOLIA_CHAIN_ID}).`);
      }

      setProvider(browserProvider);
      setSigner(signerInstance);
      setUserAddress(accounts[0]);
      setIsAuthenticated(true);
      localStorage.setItem('wallet_connected', 'true');
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet.');
    }
  };

  const createOnchainAttestation = async () => {
    if (!ceramicId) {
      toast.error('Please enter a Ceramic ID.');
      return;
    }

    try {
      // Fetch and prepare attestation data
      const response = await fetch('http://localhost:10000/api/ethereum-attestations/prepare-attestation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ceramic_id: ceramicId }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(`Failed to fetch attestation data: ${result.message}`);
        return;
      }

      const evpData = result.attestationPackage;
      setEvpData(evpData);
      console.log("evpData:", result);

      // Create on-chain attestation
      toast.info('Creating on-chain attestation...');
      const eas = new EAS(EAS_CONTRACT_ADDRESS);
      eas.connect(signer!);

      const schemaEncoder = new SchemaEncoder(
        'string ceramicStreamId,string modelCID,string rootCID,string confidenceScore,string emissionsScore,string greenScore,string locationScore,string providerNetwork,string providerCountry,string entityCompany,string reportStartDate,string reportEndDate, string templateVersion'
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
        { name: 'templateVersion', value: "1.0.0", type: 'string' },
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
        body: JSON.stringify({ ceramic_id: ceramicId, ethereum_attestation_uid: newAttestationUID }),
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

   const serializeBigInt = (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <ToastContainer />
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>On-chain Attestation</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            backgroundColor: isAuthenticated ? '#555' : '#000',
            color: '#fff',
            borderRadius: '5px',
            cursor: isAuthenticated ? 'not-allowed' : 'pointer',
            width: '100%',
          }}
          disabled={isAuthenticated}
        >
          {isAuthenticated ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={ceramicId}
          onChange={(e) => setCeramicId(e.target.value)}
          placeholder="Enter Ceramic ID"
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
        <button
          onClick={createOnchainAttestation}
          style={{
            padding: '10px 20px',
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Create Attestation
        </button>
      </div>

      {attestationUID && (
        <div style={{ marginTop: '20px', backgroundColor: '#effaf1', color: '#000000', padding: '15px', borderRadius: '5px',  wordWrap: 'break-word'}}>
          <h4>Attestation UID:</h4>
          <p>{attestationUID}</p>
          <a
            href={`${BASE_SEPOLIA_EAS_SCAN_URL}${attestationUID}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0fbb02', textDecoration: 'underline'}}
          >
            View on EAS Scan
          </a>
        </div>
      )}

      {attestationDetails && (
        <div style={{ marginTop: '20px', backgroundColor: '#effaf1', color: '#000000', padding: '15px', borderRadius: '5px' }}>
          <h4>Attestation Details:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {JSON.stringify(attestationDetails, serializeBigInt, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AttestationPage;

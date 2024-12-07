import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Alchemy API key and contract addresses
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const EAS_CONTRACT_ADDRESS = process.env.EAS_CONTRACT_ADDRESS; // Sepolia EAS contract address

if (!ALCHEMY_API_KEY) {
  throw new Error('Missing environment variables: ALCHEMY_API_KEY');
}

// Initialize Ethers.js provider with Alchemy
const provider = new ethers.AlchemyProvider('sepolia', ALCHEMY_API_KEY);

/**
 * Hook to provide ethers.js signer using browser wallet.
 */
export function useSigner() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(undefined);

  useEffect(() => {
    async function getSigner() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);

          // Get the signer from the provider
          const ethersSigner = await provider.getSigner();

          // Set the signer in the state
          setSigner(ethersSigner);
        } catch (error) {
          console.error('Error getting signer:', error);
          toast.error('Failed to connect wallet');
        }
      } else {
        toast.error('No Ethereum wallet detected');
      }
    }

    getSigner();
  }, []);

  return signer;
}

/**
 * Helper function to handle BigInt serialization
 */
export const bigIntReplacer = (key: string, value: any) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

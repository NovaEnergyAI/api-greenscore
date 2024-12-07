import { AttestationShareablePackageObject } from '@ethereum-attestation-service/eas-sdk';

// Define the type for the request body
type StoreAttestationRequest = {
  filename: string;
  textJson: string;
};

// Define the type for the response from the EAS SDK
type StoreIPFSActionReturn = {
  error: null | string;
  ipfsHash: string | null;
  offchainAttestationId: string | null;
};

// Helper function to handle BigInt serialization for JSON.stringify
const bigIntReplacer = (key: string, value: any) => {
  return typeof value === 'bigint' ? value.toString() : value;
};

// Base URL for EAS API
const BASE_URL = process.env.BASE_URL; 

/**
 * Handles the submission of a signed attestation package to the EAS off-chain store.
 * 
 * @param pkg - The attestation package (of type AttestationShareablePackageObject)
 * @returns A promise that resolves with the response from the EAS API or throws an error if the submission fails.
 */
export async function submitOffchainAttestation(
  pkg: AttestationShareablePackageObject
) {
  console.log('Request received at api/eas/submit-offchain-attestation:');

  // Prepare the payload to be sent to the EAS indexer
  const data: StoreAttestationRequest = {
    filename: `eas.txt`,
    textJson: JSON.stringify(pkg, bigIntReplacer),
  };

  console.log('api/eas/submit-offchain-attestation - Submitting attestation package to EAS API...');

  try {

    // Submit attestation package to EAS offchain indexer
    const response = await fetch(`${BASE_URL}/offchain/store`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log("response:", response);
    
    if (!response.ok) {
      console.error('Failed to submit attestation: Received non-OK status', response.statusText);
      throw new Error(`Failed to submit attestation: ${response.statusText}`);
    }

    const result: StoreIPFSActionReturn = await response.json();
    console.log('api/eas/submit-offchain-attestation - Attestation submission results');

    return result;
  } catch (error) {
    console.error('Error submitting attestation to EAS:', error);
    throw new Error('Failed to submit attestation to EAS.');
  }
}

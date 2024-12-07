import { NextApiRequest, NextApiResponse } from 'next';
import { AttestationShareablePackageObject } from '@ethereum-attestation-service/eas-sdk';
import { submitOffchainAttestation } from './submit-offchain-attestation';

/**
 * API endpoint to create and submit an off-chain attestation package to the EAS off-chain store.
 * 
 * This endpoint receives the attestation package from the frontend, reconstructs it, 
 * and submits it to the EAS API.
 * 
 * @param req - The incoming HTTP request object containing the attestation package.
 * @returns Sends a JSON response with the status of the operation and the EAS response data or error message.
 */
export default async function createOffchainAttestation(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request received at api/eas/create-offchain-attestation:');

  try {
    const { attestationPackage } = req.body; 

    if (!attestationPackage) {
      console.error('Missing attestation package in the request body.');
      return res.status(400).json({ error: 'Missing attestation package' });
    }

    console.log('api/eas/create-offchain-attestation - Reconstructing attestation package for submission...');
    const reconstructedPackage: AttestationShareablePackageObject = {
      signer: attestationPackage.signer,
      sig: attestationPackage.sig,  
    };

    // Submit the reconstructed package to EAS
    console.log('api/eas/create-offchain-attestation - Submitting reconstructed attestation package to EAS...');
    const easResponse = await submitOffchainAttestation(reconstructedPackage);

    if (easResponse.error) {
      console.error('Error received from EAS:', easResponse.error);
      throw new Error(easResponse.error);
    }

    console.log('api/eas/create-offchain-attestation - Attestation successfully submitted via create-offchain-attestation.');
    return res.status(200).json({
      success: true,
      message: 'Attestation submitted successfully!',
      easResponse,
    });

  } catch (error) {
    console.error('Error submitting offchain attestation:', error);
    return res.status(500).json({ error: 'Failed to submit offchain attestation.' });
  }
}

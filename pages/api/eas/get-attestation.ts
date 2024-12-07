import { NextApiRequest, NextApiResponse } from 'next';
import { EAS } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';

// Initialize provider and contract details
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const easContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia EAS contract address

if (!ALCHEMY_API_KEY) {
  throw new Error('Missing environment variables: ALCHEMY_API_KEY');
}

const provider = new ethers.AlchemyProvider('sepolia', ALCHEMY_API_KEY);
const eas = new EAS(easContractAddress);
eas.connect(provider);

// Helper function to convert BigInts to strings recursively
function stringifyBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(item => stringifyBigInt(item));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, stringifyBigInt(value)]));
  }
  return obj;
}

export default async function getAttestation(req: NextApiRequest, res: NextApiResponse) {
  console.log("request received at api/eas/get-attestation");

  const { uid } = req.query;
  console.log(uid);
  
  if (!uid) {
    return res.status(400).json({ error: 'Missing UID' });
  }

  try {
    // Fetch attestation using the EAS SDK
    const attestation = await eas.getAttestation(uid as string);

    // If attestation data is found, return it after handling BigInt serialization
    if (attestation) {
      return res.status(200).json(stringifyBigInt(attestation));
    } else {
      return res.status(404).json({
        error: 'Attestation not found',
      });
    }
  } catch (error) {
    console.error('Error fetching attestation:', error);
    return res.status(500).json({ error: error.message });
  }
}

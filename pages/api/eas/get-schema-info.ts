// api/pages/eas/get-schema-info.ts

import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

// Load environment variables
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;  // Alchemy API key for Sepolia network
const schemaRegistryContractAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';  // Sepolia schema registry contract address

if (!ALCHEMY_API_KEY) {
  throw new Error('Missing environment variables: ALCHEMY_API_KEY');
}

// Initialize Alchemy provider for Sepolia network
const provider = new ethers.AlchemyProvider('sepolia', ALCHEMY_API_KEY);

// Initialize the SchemaRegistry with the contract address on Sepolia
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

// Connect the provider to the SchemaRegistry
schemaRegistry.connect(provider);

export default async function getSchemaInfo(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract schema UID from the request query
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: 'Schema UID is required' });
    }

    // Retrieve the schema information
    const schemaRecord = await schemaRegistry.getSchema({ uid: String(uid) });

    // Return the schema information
    return res.status(200).json({ schemaRecord });
  } catch (error) {
    // Catch and return any errors encountered during the process
    return res.status(500).json({ error: error.message });
  }
}

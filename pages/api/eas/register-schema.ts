import { SchemaRegistry } from '@ethereum-attestation-service/eas-sdk';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';

// Load environment variables
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;  // Alchemy API key for Sepolia network
const PRIVATE_KEY = process.env.PRIVATE_KEY;  // Wallet private key for signing transactions

// Ensure that required environment variables are present
if (!ALCHEMY_API_KEY || !PRIVATE_KEY) {
  throw new Error('Missing environment variables: ALCHEMY_API_KEY or PRIVATE_KEY');
}

// Initialize Alchemy provider for Sepolia network
const provider = new ethers.AlchemyProvider('sepolia', ALCHEMY_API_KEY);

// Initialize wallet with private key and connect to Alchemy provider (acts as the transaction signer)
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize the SchemaRegistry with the contract address on Sepolia
const schemaRegistryContractAddress = '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';  // Sepolia schema registry contract address
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

// Connect the signer (wallet) to the SchemaRegistry
schemaRegistry.connect(signer);

export default async function registerSchema(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Define the schema structure (adjust to match the structure needed for your application)
    const schema = 'string documentId, uint8 providerNetworkType, string[] minerIds, uint256 greenScore, uint8 emissionsScore, string reportStartDate, string reportEndDate, uint256 confidenceScore, string entityCompany, uint8 isHistoricData, uint256 locationScore, uint256 marginalEmissionsIntensity, uint256 globalAverageGridEmissionsFactor, uint256 globalAverageMarginalEmissionFactor';  // Update the schema string as required
    const resolverAddress = '0x0000000000000000000000000000000000000000';  // Address of the resolver on Sepolia
    const revocable = true;  // Indicates whether the attestation can be revoked

    // Register the schema using the EAS SDK
    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    // Optional: Wait for the transaction to be mined and validated on the network
    await transaction.wait();

    // Return the transaction hash as a response
    return res.status(200).json({ transaction: transaction });
  } catch (error) {
    // Catch and return any errors encountered during the process
    return res.status(500).json({ error: error.message });
  }
}

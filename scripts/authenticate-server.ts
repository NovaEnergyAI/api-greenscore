import type { CeramicApi } from '@ceramicnetwork/common';
import type { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { randomBytes } from 'crypto'; // Node.js equivalent of crypto.getRandomValues

const DID_SEED_KEY = 'ceramic:did_seed';

export const authenticateCeramicServer = async (ceramic: CeramicApi, compose: ComposeClient) => {
  // Use environment variables or secure storage for secrets in a real application
  let seed = process.env.DID_SEED;
  if (!seed) {
    seed = randomBytes(32).toString('hex');
    process.env.DID_SEED = seed; // Save the seed in memory for demonstration purposes
  }
  const seed_array = Uint8Array.from(Buffer.from(seed, 'hex'));
  const provider = new Ed25519Provider(seed_array);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  compose.setDID(did);
  console.log('Key DID authentication successful (ServerAuth.ts)');
};

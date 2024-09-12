import type { CeramicApi } from '@ceramicnetwork/common';
import type { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { DIDSession } from 'did-session';

const DID_SEED_KEY = 'ceramic:did_seed';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const authenticateCeramic = async (ceramic: CeramicApi, compose: ComposeClient) => {
  let auth_type = localStorage.getItem('ceramic:auth_type');
  if (auth_type === 'key') {
    await authenticateKeyDID(ceramic, compose);
  } else if (auth_type === 'eth') {
    await authenticateEthPKH(ceramic, compose);
  }
  localStorage.setItem('logged_in', 'true');
};

const authenticateKeyDID = async (ceramic: CeramicApi, compose: ComposeClient) => {
  let seed_array: Uint8Array;
  if (localStorage.getItem(DID_SEED_KEY) === null) {
    let seed = crypto.getRandomValues(new Uint8Array(32));
    let seed_json = JSON.stringify(seed, (key, value) => (value instanceof Uint8Array ? Array.from(value) : value));
    localStorage.setItem(DID_SEED_KEY, seed_json);
    seed_array = seed;
  } else {
    let seed_json_value = localStorage.getItem(DID_SEED_KEY);
    let seed_object = JSON.parse(seed_json_value);
    seed_array = Uint8Array.from(seed_object);
  }
  const provider = new Ed25519Provider(seed_array);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  compose.setDID(did);
  console.log('Key DID authentication successful (authenticate.ts)');
};

const authenticateEthPKH = async (ceramic: CeramicApi, compose: ComposeClient) => {
  if (!window.ethereum) {
    throw new Error('No injected Ethereum provider found.');
  }

  const ethProvider = window.ethereum;
  const addresses = await ethProvider.request({ method: 'eth_requestAccounts' });
  const accountId = await getAccountId(ethProvider, addresses[0]);
  const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId);

  const session = await DIDSession.authorize(authMethod, { resources: compose.resources });
  localStorage.setItem('ceramic:eth_did', session.serialize());

  compose.setDID(session.did);
  ceramic.did = session.did;
  console.log('Ethereum PKH authentication successful (authenticate.ts)');
};
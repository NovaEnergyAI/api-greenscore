import { ethers } from 'ethers';
import { DIDSession } from 'did-session';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import type { CeramicApi } from '@ceramicnetwork/common';
import type { ComposeClient } from '@composedb/client';

declare global {
  interface Window {
    ethereum: any;
  }
}

// Main function to handle authentication
export const authenticateCeramic = async (ceramic: CeramicApi, compose: ComposeClient) => {
  try {
    const authType = localStorage.getItem('ceramic:auth_type');
    if (authType === 'eth') {
      await authenticateEthPKH(ceramic, compose);
    } else {
      throw new Error('Unsupported authentication type');
    }
    localStorage.setItem('logged_in', 'true');
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};

// Function to handle Ethereum PKH authentication
const authenticateEthPKH = async (ceramic: CeramicApi, compose: ComposeClient) => {
  const sessionStr = localStorage.getItem('ceramic:eth_did');
  let session;

  if (sessionStr) {
    session = await DIDSession.fromSession(sessionStr);
  }

  if (!session || session.isExpired) {
    if (!window.ethereum) {
      throw new Error('No injected Ethereum provider found. Please install MetaMask or another wallet.');
    }

    // Use Web3Provider for ethers.js v6
    const ethProvider = window.ethereum;


    const addresses = await ethProvider.enable({
      method: "eth_requestAccounts",
    });

    // Get the accountId correctly using the provider
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(ethProvider, accountId);

    session = await DIDSession.authorize(authMethod, { resources: compose.resources });

    // Store the session in localStorage
    localStorage.setItem('ceramic:eth_did', session.serialize());
  }

  // Set Ceramic's DID to the session's DID
  compose.setDID(session.did);
  ceramic.did = session.did;
  console.log('Ethereum PKH Authentication successful:', session.did.id);
};

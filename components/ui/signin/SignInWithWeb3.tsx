import styles from './SignInWithWeb3.module.scss';
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  safeWallet,
  trustWallet,
  zerionWallet,
  bloctoWallet,
  frameWallet,
  rainbowWallet,
  phantomWallet,
  en,
} from '@thirdweb-dev/react';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAddress } from '../../../context/AddressContext';
import { useUser } from '../../../context/UserContext';

import Button, { ButtonStyleEnum } from '@components/ui/button/Button';

import { generateNonce } from 'common/utilities';

let signer: ethers.Signer;
let provider: ethers.providers.Web3Provider;

export default function SignInWithWeb3() {
  const { setAddress } = useAddress();
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const { setUser } = useUser();

  useEffect(() => {
    const getAddress = async () => {
      if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        try {
          const address = await signer.getAddress();
          setWallet(address);
        } catch (error) {
          console.error('Error obtaining address, failed to autoconnect wallet.');
        }
      }
    };

    getAddress();
  }, []);

  const onAuthenticate = async ({ address, message, signature }) => {
    let result;

    try {
      const response = await fetch('https://api-nova.onrender.com/api/users/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address, message: message, wallet_signature: signature }),
      });
      result = await response.json();
    } catch (e) {
      setStatus('Error: ' + e);
    }

    if (result.error) {
      setStatus('No user found. Please enter email and password to register!');
    } else {
      setStatus('Success!');
    }

    return result;
  };

  const signLoginMessage = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // REFERENCE: eips.ethereum.org/EIPS/eip-4361#message-format for secure login message generation
        const domain = 'novaenergy.ai';
        const address = await signer.getAddress();
        const nonce = await generateNonce();
        const issuedAt = new Date().toISOString();
        const network = await provider.getNetwork();
        const chainId = network.chainId;
        const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\nURI: ${domain}\nVersion: 1\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
        const signature = await signer.signMessage(message);
        setAddress(address);
        console.log('Login obtained successfully');
        // const result = await onAuthenticate({ address: address, message: message, signature: signature });
        setUser({ address: address, message: message, signature: signature });
      } catch (error) {
        console.error('Error signing in with Web3', error);
      }
    }
  };

  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId="6c008bdcd6760736ab3ffcd4deb713dd"
      locale={en()}
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        safeWallet({
          personalWallets: [metamaskWallet(), coinbaseWallet(), walletConnect(), trustWallet(), zerionWallet(), bloctoWallet(), frameWallet(), rainbowWallet(), phantomWallet()],
        }),
        trustWallet(),
        zerionWallet(),
        bloctoWallet(),
        frameWallet(),
        rainbowWallet(),
        phantomWallet(),
      ]}
    >
      {wallet && !status && (
        <Button style={ButtonStyleEnum.BORDER_BLACK} withArrow={false} className={styles.fullWidthButton} onClick={signLoginMessage}>
          Authenticated via. Web3
        </Button>
      )}
      {status && (
        <Button style={ButtonStyleEnum.BORDER_BLACK} withArrow={false} className={styles.fullWidthButton}>
          {status}
        </Button>
      )}
      {!wallet && (
        <ConnectWallet
          theme={'dark'}
          modalSize={'wide'}
          style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '1rem', marginBottom: '1rem' }}
          showThirdwebBranding={true}
          onConnect={() => window.location.reload()}
        />
      )}
    </ThirdwebProvider>
  );
}

// @ts-nocheck

import Button from '@system/Button';
import React, { useEffect, useState } from 'react';
import {
  bloctoWallet,
  coinbaseWallet,
  ConnectWallet,
  en,
  frameWallet,
  metamaskWallet,
  phantomWallet,
  rainbowWallet,
  safeWallet,
  ThirdwebProvider,
  trustWallet,
  walletConnect,
  zerionWallet,
} from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { generateNonce } from '@common/utilities';
import { web3Authenticate } from '@common/queries';

let signer: ethers.Signer;
let provider: ethers.providers.Web3Provider;

export default function SignInWithWeb3({ setUser, wallet, setWallet }) {
  const [status, setStatus] = useState('Authenticate via web3');

  useEffect(() => {
    // Fetch address only if the wallet is not already set
    const getAddress = async () => {
      if (!wallet && typeof window.ethereum !== 'undefined') {
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          signer = provider.getSigner();
          const address = await signer.getAddress();
          setWallet(address);
        } catch (error) {
          console.error('Error obtaining address, failed to autoconnect wallet:', error);
        }
      }
    };

    getAddress();
  }, [wallet, setWallet]);

  const onAuthenticate = async ({ address, message, signature }) => {
    try {
      const result = await web3Authenticate({
        address,
        message,
        signature,
        email: null,
        password: null,
      });

      if (!result) {
        setStatus('Something went wrong. Please register by putting your name and password.');
      } else {
        setStatus('Success!');
        setUser(result.user);
      }

      return result;
    } catch (error) {
      console.error('Error during authentication:', error);
      setStatus('Authentication failed. Please try again.');
    }
  };

  const onSignMessage = async () => {
    if (typeof window.ethereum !== 'undefined' && signer) {
      try {
        const domain = 'YOUR_DOMAIN_HERE';
        const address = await signer.getAddress();
        const nonce = await generateNonce();
        const issuedAt = new Date().toISOString();
        const { chainId } = await provider.getNetwork();
        const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\nURI: ${domain}\nVersion: 1\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
        const signature = await signer.signMessage(message);
        await onAuthenticate({ address, message, signature });
      } catch (error) {
        console.error('Error signing in with Web3:', error);
        setStatus('Sign in failed. Please check your wallet.');
      }
    } else {
      setStatus('Wallet not detected. Please install a Web3 wallet.');
    }
  };

  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId="6c008bdcd6760736ab3ffcd4deb713dd"
      locale={en()}
      supportedWallets={[
        bloctoWallet(),
        coinbaseWallet(),
        frameWallet(),
        metamaskWallet(),
        phantomWallet(),
        rainbowWallet(),
        safeWallet({
          personalWallets: [
            bloctoWallet(),
            coinbaseWallet(),
            frameWallet(),
            metamaskWallet(),
            phantomWallet(),
            rainbowWallet(),
            trustWallet(),
            walletConnect(),
            zerionWallet(),
          ],
        }),
        trustWallet(),
        walletConnect(),
        zerionWallet(),
      ]}
    >
      {wallet ? (
        <Button style={{ marginTop: 24, width: '100%' }} onClick={onSignMessage}>
          {status}
        </Button>
      ) : (
        <ConnectWallet
          theme={'dark'}
          modalSize={'wide'}
          style={{ width: '100%', marginTop: '24px', padding: '24px' }}
          showThirdwebBranding={false}
          onConnect={(address) => setWallet(address)} // Directly setting wallet
        />
      )}
    </ThirdwebProvider>
  );
}

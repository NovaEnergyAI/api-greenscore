import React, { useState } from "react";
import { authenticateCeramic } from "@root/scripts/authenticate";
import { useCeramicContext } from "@root/context/CeramicContext";

const AuthPrompt = () => {
  const [isVisible, setIsVisible] = useState(true);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const isLogged = () => { 
    return localStorage.getItem("logged_in") == "true";
  };

  const handleOpen = () => {
    if (localStorage.getItem("logged_in")) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleKeyDid = () => {
    localStorage.setItem("ceramic:auth_type", "key");
    authenticateCeramic(ceramic, composeClient);
    setIsVisible(false);
  };

  const handleEthPkh = () => {
    localStorage.setItem("ceramic:auth_type", "eth");
    authenticateCeramic(ceramic, composeClient);
    setIsVisible(false);
  };

  return (
    <div>
      {isVisible && (
        <div>
          <div>
            <h2>Authenticate</h2>
            <span>
              <button onClick={handleKeyDid}>Key DID</button>
            </span>
            <span>
              <button onClick={handleEthPkh}>Ethereum DID PKH</button>
            </span>
            <br />
            <br />
            <strong>Key DID:</strong> A DID generated by Ceramic that is stored in your browser&apos;s local storage. It should already
            <br />
            be generated during setup process.
            <br />
            <br />
            <strong>Ethereum DID PKH:</strong> A DID generated by your wallet (in simpler terms: login with MetaMask).
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPrompt;

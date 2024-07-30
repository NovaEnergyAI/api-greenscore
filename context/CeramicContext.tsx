'use client'; 

import { createContext, useContext, useEffect, useState} from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';

import { definition } from '../composites/runtime-composite';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { authenticateCeramic } from '../scripts/authenticate';

/**
 * Configures ceramic Client & create context.
 */
const ceramic = new CeramicClient('http://localhost:7007');

const composeClient = new ComposeClient({
  ceramic: ceramic,
  definition: definition as RuntimeCompositeDefinition,
});

const CeramicContext = createContext({
  ceramic,
  composeClient,
  isAuthenticated: false,
});

export const CeramicWrapper = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initCeramic = async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('logged_in')) {
        await authenticateCeramic(ceramic, composeClient);
        setIsAuthenticated(true);
      }
    };

    initCeramic();
  }, []);

  return (
    <CeramicContext.Provider value={{ ceramic, composeClient, isAuthenticated}}>
      {children}
    </CeramicContext.Provider>
  );
};

/**
 * Provide access to the Ceramic & Compose clients.
 * @example const { ceramic, compose } = useCeramicContext()
 * @returns CeramicClient
 */
export const useCeramicContext = () => useContext(CeramicContext);
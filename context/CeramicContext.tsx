'use client'; // Add this directive at the top

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { ComposeClient } from '@composedb/client';

import { definition } from '../composites/runtime-composite';
import { RuntimeCompositeDefinition } from '@composedb/types';
import { authenticateCeramic } from '../scripts/authenticate';
import { authenticateCeramicServer } from '../scripts/authenticate-server';

/**
 * Configure ceramic Client & create context.
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
  getAuthenticatedCeramic: async () => ({ ceramic, composeClient }),
});

export const CeramicWrapper = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initCeramic = async () => {
      if (typeof window !== 'undefined' && localStorage.getItem('logged_in')) {
        await authenticateCeramic(ceramic, composeClient);
        await authenticateCeramicServer(ceramic, composeClient);
        setIsAuthenticated(true);
      }
    };

    initCeramic();
  }, []);

  return (
    <CeramicContext.Provider value={{ ceramic, composeClient, isAuthenticated, getAuthenticatedCeramic}}>
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
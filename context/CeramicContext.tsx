import { createContext, useContext } from "react";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";

// Import compiled composite:
import { definition } from "../composites/runtime-composite.js";
import { RuntimeCompositeDefinition } from "@composedb/types";

/**
 * Ceramic client & creating context:
 */
const ceramic = new CeramicClient("http://localhost:7007");

const composeClient = new ComposeClient({
    ceramic: "https://localhost:7007",
    definition: definition as RuntimeCompositeDefinition
});

const CeramicContext = createContext({ceramic: ceramic, composeClient: composeClient});

export const CeramicWrapper = ({ children }: any) => {
    return (
        <CeramicContext.Provider value={{ceramic, composeClient}}>
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
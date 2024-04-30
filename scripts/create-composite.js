
// Use dynamic imports for ESM modules
async function loadModules() {
  const { CeramicClient } = await import('@ceramicnetwork/http-client');
  const { DID } = await import('dids');
  const { Ed25519Provider } = await import('key-did-provider-ed25519');
  const { getResolver } = await import('key-did-resolver');
  const { fromString } = await import('uint8arrays/from-string');
  const { createComposite, writeEncodedComposite } = await import('@composedb/devtools-node');

  return { CeramicClient, DID, Ed25519Provider, getResolver, fromString, createComposite, writeEncodedComposite };
}

async function runCeramicOperations() {
  const {
      CeramicClient, DID, Ed25519Provider, getResolver, fromString,
      createComposite, writeEncodedComposite
  } = await loadModules();

  const privateKeyHex = process.env.PRIVATE_KEY;  // Ensure to replace with actual private key
  const privateKey = fromString(privateKeyHex, 'base16');

  const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(privateKey),
  });

  try {
      await did.authenticate();

      const ceramic = new CeramicClient('http://localhost:7007');
      ceramic.did = did;  // An authenticated DID must be set on the Ceramic instance

      const composite = await createComposite(ceramic, './composites/evp-template.graphql');
      await writeEncodedComposite(composite, './composites/evp-template-composite.json');

      console.log('Composite created and written successfully.');
  } catch (error) {
      console.error('Error during Ceramic operations:', error);
  }
}

runCeramicOperations();

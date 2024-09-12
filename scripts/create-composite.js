
// Using dynamic imports for ESM modules
async function loadModules() {
  const { CeramicClient } = await import('@ceramicnetwork/http-client');
  const { DID } = await import('dids');
  const { Ed25519Provider } = await import('key-did-provider-ed25519');
  const { getResolver } = await import('key-did-resolver');
  const { fromString } = await import('uint8arrays/from-string');
  const { createComposite, writeEncodedComposite } = await import('@composedb/devtools-node');

  return { CeramicClient, DID, Ed25519Provider, getResolver, fromString, createComposite, writeEncodedComposite };
}

async function runCreateComposite() {
  const {
      CeramicClient, DID, Ed25519Provider, getResolver, fromString,
      createComposite, writeEncodedComposite
  } = await loadModules();

  // Hexadecimal-encoded private key for a DID having admin access to the target Ceramic node
  // Replace the example key here by your admin private key
  const privateKeyHex = fromString('b0cb[...]515f', 'base16');
  const privateKey = fromString(privateKeyHex, 'base16');

  const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(privateKey),
  });

  try {
      await did.authenticate();

      // Replace by the URL of the Ceramic node you want to deploy the Models to
      const ceramic = new CeramicClient('http://localhost:7007');

      // An authenticated DID must be set on the Ceramic instance
      ceramic.did = did;  

      // Replace by the path to the source schema file
      const composite = await createComposite(ceramic, './composites/evp-template.graphql');

      // Replace by the path to the encoded composite file
      await writeEncodedComposite(composite, './composites/evp-template-composite.json');

      console.log('Composite created and written successfully.');
  } catch (error) {
      console.error('Error during Ceramic operations:', error);
  }
}

runCreateComposite();

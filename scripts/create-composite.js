// Load environment variables
const CERAMIC_URL = process.env.CERAMIC_URL;

if (!CERAMIC_URL) {
  throw new Error('Missing environment variables: CERAMIC_URL');
}

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
  const { CeramicClient, DID, Ed25519Provider, getResolver, fromString, createComposite, writeEncodedComposite } = await loadModules();

  // Hexadecimal-encoded private key for a DID having admin access to the target Ceramic node
  // Replace the example key here by your admin private key
  const privateKeyHex = process.env.CERAMIC_ADMIN_PRIVATE_KEY;
  const privateKey = fromString(privateKeyHex, 'base16');

  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(privateKey),
  });

  try {
    await did.authenticate();

    // Replace by the URL of the Ceramic node to deploy the models to:
    const ceramic = new CeramicClient(CERAMIC_URL);

    // An authenticated DID must be set on the Ceramic instance
    ceramic.did = did;

    // Replace by the path to the source schema file
    const composite = await createComposite(ceramic, './composites/evp-report.graphql');

    // Replace by the path to the encoded composite file & write the encoded composite
    const encodedComposite = await writeEncodedComposite(composite, './composites/evp-report-composite.json');

    console.log('Composite created and written successfully.');
    return encodedComposite;
  } catch (error) {
    console.error('Error during Ceramic operations:', error);
    return { error: 'Error during Ceramic operations', message: error };
  }
}

runCreateComposite();

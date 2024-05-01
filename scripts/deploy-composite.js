
// Use dynamic imports for ESM modules
async function loadModules() {
    const { CeramicClient } = await import('@ceramicnetwork/http-client');
    const { DID } = await import('dids');
    const { Ed25519Provider } = await import('key-did-provider-ed25519');
    const { getResolver } = await import('key-did-resolver');
    const { fromString } = await import('uint8arrays/from-string');
    const { readEncodedComposite } = await import('@composedb/devtools-node');
  
    return { CeramicClient, DID, Ed25519Provider, getResolver, fromString, readEncodedComposite};
  }

async function runDeployComposite(){
  // Hexadecimal-encoded private key for a DID having admin access to the target Ceramic node
  // Replace the example key here by your admin private key
  const privateKey = fromString('b0cb[...]515f', 'base16')

  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(privateKey),
  })
  await did.authenticate()

  // Replace by the URL of the Ceramic node you want to deploy the Models to
  const ceramic = new CeramicClient('http://localhost:7007')
  
  // An authenticated DID with admin access must be set on the Ceramic instance
  ceramic.did = did

  // Replace by the path to the local encoded composite file
  const composite = await readEncodedComposite(ceramic, 'my-first-composite.json')

  // Notify the Ceramic node to index the models present in the composite
  await composite.startIndexingOn(ceramic)
}
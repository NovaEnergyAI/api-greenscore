import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { definition } from "../../../composites/runtime-composite.js"

const ceramic = new CeramicClient("http://localhost:7007");
const composeClient = new ComposeClient({
    ceramic: "http://localhost:7007",
    definition,
})

async function authenticateCeramic(){

}

export default async function handler(req, res){
    if(req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }

    const {type, greenscore, auditDocument} = req.body;

    await authenticateCeramic(); 

    try {
        const response = await composeClient.executeQuery(`
            mutation {
                createStorageProviderAuditReportDocument(input: {
                content: {
                    type: "${type}",
                    greenscore: ${JSON.stringify(greenscore)},
                    audit_document: ${JSON.stringify(auditDocument) || null}
                }
                }) {
                document {
                    id
                }
                }
            }
        `);

        const documentId = response.data.createStorageProviderAuditReportDocument.document.id;

        return res.status(200).json({ id: documentId, message: "Asset created successfully" });
    } catch (error){
        console.error("Error creating asset:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";

// Import the compiled composite:
import { definition } from "../../../composites/runtime-composite.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end('Method Not Allowed');
    return;
  }

  const ceramic = new CeramicClient("http://localhost:7007");
  const composeClient = new ComposeClient({
    ceramic: ceramic,
    definition: definition as RuntimeCompositeDefinition
  });

  try {
    const data = await composeClient.executeQuery(`
      query {
        storageProviderAuditReportDocuments {
          edges {
            node {
              type
              greenscore {
                date
                greenscoreDetails {
                  green_score
                }
              }
              audit_document {
                created_at
              }
              id
            }
          }
        }
      }
    `);

    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data from Ceramic:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
}

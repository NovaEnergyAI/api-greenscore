import * as S from 'common/server';
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";

// Import the compiled composite:
import { definition } from "../../../composites/runtime-composite.js";

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const ceramic = new CeramicClient("http://localhost:7007");
    const composeClient = new ComposeClient({
      ceramic: ceramic,
      definition: definition as RuntimeCompositeDefinition
    });

    // Extract data from the request body
    const { type, greenscore, auditDocument } = req.body;
    try {
      // Perform the mutation using ComposeClient
      const mutationResult = await composeClient.executeQuery(`
        mutation {
          createStorageProviderAuditProfile(input: {
            content: {
              type: "${type}",
              greenscore: "${greenscore}",
              audit_document: "${auditDocument}"
            }
          }) {
            document {
              type
              greenscore {
                date
                greenscoreDetails {
                  type
                  status
                  document_id
                  green_score
                  normalized_el
                  location_score
                  provider_email
                  emissions_score
                  report_end_date
                  confidence_score
                  provider_location
                  report_start_date
                  provider_full_name
                  network_marginal_emissions {
                    network_marginal_emissions
                    total_network_electricity_consumption
                    total_network_renewable_energy_production
                    global_average_grid_emissions_factor_value
                  }
                }
              }
            }
          }
        `);
      
        console.log("Request body:", mutationResult.data);
      res.status(200).json({ success: true, data: mutationResult.data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

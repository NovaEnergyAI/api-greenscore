import { NextApiRequest, NextApiResponse } from 'next';
import { authenticateCeramic } from '../../../scripts/authenticate';
import { ceramic, composeClient } from '../../../context/CeramicContext';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log("Received request body: ", req.body);

    const { type, greenscore, audit_document } = req.body;

    try {
      // Ensure authentication before proceeding
      if (!ceramic.did) {
        await authenticateCeramic(ceramic, composeClient);
      }

      const mutation = `
        mutation CreateStorageProviderAuditReportDocument($input: CreateStorageProviderAuditReportDocumentInput!) {
          createStorageProviderAuditReportDocument(input: $input) {
            document {
              id
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
                  benchmark_emission_intensity
                  marginal_emissions_intensity
                  scope2_emissions_calculation {
                    scope2_emissions
                    grid_emissions_factor_value
                    actual_net_power_consumed_value
                    renewable_energy_consumption_value
                    average_data_storage_capacity_value
                  }
                  emission_intensity_calculation {
                    scope2_emissions
                    emission_intensity
                  }
                  network_scope2_emissions_calculation {
                    network_scope2_emissions
                    network_average_renewable_energy_value
                    estimate_cumulative_energy_use_per_time
                    global_average_grid_emissions_factor_value
                    average_raw_byte_capacity_for_reporting_time_value
                  }
                  benchmark_marginal_emission_intensity
                  normalized_marginal_emission_intensity
                }
              }
              audit_document {
                type
                created_at
                evp_report {
                  type
                  user_id
                  created_at
                  updated_at
                  audit_review {
                    auditor
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
                        benchmark_emission_intensity
                        marginal_emissions_intensity
                        scope2_emissions_calculation {
                          scope2_emissions
                          grid_emissions_factor_value
                          actual_net_power_consumed_value
                          renewable_energy_consumption_value
                          average_data_storage_capacity_value
                        }
                        emission_intensity_calculation {
                          scope2_emissions
                          emission_intensity
                        }
                        network_scope2_emissions_calculation {
                          network_scope2_emissions
                          network_average_renewable_energy_value
                          estimate_cumulative_energy_use_per_time
                          global_average_grid_emissions_factor_value
                          average_raw_byte_capacity_for_reporting_time_value
                        }
                        benchmark_marginal_emission_intensity
                        normalized_marginal_emission_intensity
                      }
                    }
                    audit_outputs {
                      date
                      audit_outputs {
                        status
                        feedback
                        review_status
                        recommendation_file
                        scoring_metric_file
                      }
                    }
                    report_option
                    review_status
                    provider_evp_status
                    provider_evp_submission_date
                  }
                  audit_status
                  submitted_at
                  energy_production {
                    status
                    inspection_date
                    solar_watt_peak
                    purchase_receipt
                    installation_date
                    solar_panel_brand
                    inspection_document
                    method_of_measurement
                    number_of_solar_panels
                    frequency_of_measurement
                    solar_panel_modal_number
                    filecoin_renewable_energy_usage
                  }
                  water_consumption {
                    status
                    end_date
                    reference
                    start_date
                    water_company
                    water_bill_files
                    filecoin_water_usage
                  }
                  location_information {
                    status
                    provider_city
                    provider_state
                    provider_country
                    provider_zipcode
                    address_confirmed
                    provider_location
                  }
                  hardware_configuration {
                    status
                    hardware {
                      description
                      hardware_type
                      supporting_file
                      hardware_details
                    }
                    provider_city
                    provider_state
                    provider_country
                    address_confirmed
                    provider_location
                  }
                  electricity_consumption {
                    status
                    end_date
                    reference
                    start_date
                    electricity_company
                    electricity_bill_file
                    estimation_methodology
                    annual_electricity_usage
                    actual_electricity_consumed
                    actual_electricity_returned
                    actual_electricity_delivered
                    electricity_not_powering_filecoin
                  }
                  renewable_energy_procurement {
                    status
                    end_date
                    start_date
                    supporting_file
                    filecoin_energy_usage
                    renewable_energy_type
                    supporting_certificates
                    actual_electricity_returned
                    actual_electricity_delivered
                    renewable_energy_purchased_from
                  }
                  preliminary_results_rec_matching {
                    status
                    supporting_file
                    actual_electricity_consumed
                    actual_electricity_returned
                    actual_electricity_delivered
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        input: {
          content: {
            type,
            greenscore,
            audit_document,
          }
        }
      };

      const mutationResult = await composeClient.executeQuery(mutation, variables);
      console.log("Mutation Result: ", mutationResult);

      if (mutationResult.errors) {
        console.error("Mutation Errors: ", mutationResult.errors);
        res.status(500).json({ success: false, message: mutationResult.errors[0].message });
      } else {
        res.status(200).json({ success: true, data: mutationResult.data });
      }
    } catch (error) {
      console.error("Error executing mutation: ", error);
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

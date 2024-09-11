'use client';

import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EVPNode {
  id: string;
  streamId: string;
  evpId: string;
  organizationId: string;
  type: string;
  createdAt: string;
  evpReportDB?: {
    type?: string;
    createdAt?: string;
    updatedAt?: string;
    submittedAt?: string;
    auditStatus?: number;
    entityCompany?: string;
    providerNetworkType?: string;
    minerIds?: string[];
    reportStartDate?: string;
    reportEndDate?: string;
    locationInformation?: {
      addressConfirmed?: boolean;
      createdAt?: string;
      entityCompany?: string;
      isHistoricData?: boolean;
      providerCity?: string;
      providerCountry?: string;
      providerLocation?: string;
      providerState?: string;
      providerZipcode?: string;
      status?: number;
      updatedAt?: string;
    };
    hardwareConfiguration?: {
      status?: number;
      hardware?: {
        description?: string;
        hardwareType?: string;
        supportingFile?: string[];
        hardwareDetails?: string;
      };
      createdAt?: string;
      updatedAt?: string;
      isHistoricData?: boolean;
    };
    waterConsumption?: {
      status?: number;
      createdAt?: string;
      updatedAt?: string;
      startDate?: string;
      endDate?: string;
      reference?: string;
      waterUsage?: boolean;
      waterConsumed?: number;
      waterBillFiles?: string[];
      waterCompany?: string;
      isHistoricData?: boolean;
    };
    electricityConsumption?: {
      actualElectricityConsumed?: string;
      actualElectricityDelivered?: string;
      actualElectricityReturned?: string;
      annualElectricityUsage?: string;
      electricityBillFiles?: string[];
      electricityCompany?: string;
      electricityNotPoweringInfrastructure?: string;
      endDate?: string;
      estimationMethodology?: string;
      reference?: string;
      startDate?: string;
      status?: number;
      totalElectricityUsedForNodeOperations?: number;
      isHistoricData?: boolean;
    };
    energyProduction?: {
      createdAt?: string;
      frequencyOfMeasurement?: string;
      isHistoricData?: boolean;
      inspectionDate?: string;
      inspectionFiles?: string[];
      installationDate?: string;
      methodOfMeasurement?: string;
      numberOfSolarPanels?: number;
      purchaseFiles?: string[];
      renewableEnergyUsage?: boolean;
      solarPanelBrand?: string;
      solarPanelModalNumber?: string;
      solarWattPeak?: string;
      status?: number;
      totalElectricityControlled?: number;
    };
    renewableEnergyProcurement?: {
      status?: number;
      endDate?: string;
      createdAt?: string;
      startDate?: string;
      updatedAt?: string;
      energyUsage?: boolean;
      documentFiles?: string[];
      isHistoricData?: boolean;
      supportingFiles?: string[];
      renewableEnergyType?: string;
      actualElectricityDelivered?: string;
      actualElectricityReturned?: string;
      networkRenewableEnergyPurchases?: number;
      electricityPurchased?: number;
      renewableEnergyPurchasedFrom?: string;
      networkRenewableElectricityPurchasedSource?: string;
      networkRenewableElectricityPurchasedDocs?: string;
    };
    preliminaryResultsRecMatching?: {
      status?: number;
      endDate?: string;
      createdAt?: string;
      startDate?: string;
      updatedAt?: string;
      actualElectricityConsumed?: string;
      actualElectricityDelivered?: string;
      actualElectricityReturned?: string;
      emissionsFactor?: number;
      totalEmissions?: number;
      supportingFile?: string;
      timePeriod?: string;
      isHistoricData?: boolean;
    };
    auditReview?: {
      providerEvpStatus?: number;
      reviewStatus?: number;
      auditorEvpSubmissionDate?: string;
      providerEvpSubmissionDate?: string;
      reportOption?: number;
    };
    greenscoreID?: string;
  };
  greenscoreDB?: {
    benchmarkEmissionIntensity?: number;
    benchmarkMarginalEmissionIntensity?: number;
    confidenceScore?: number;
    confidenceScoreDetails?: {
      locationConfidence?: number;
      locationInformationPercentageInformation?: string;
      nodeIdConfidence?: number;
      nodeIDConfidencePercentageInformation?: string;
      hardwareConfidence?: number;
      hardwareConfidencePercentageInformation?: string;
      waterUseConfidence?: number;
      waterUseConfidencePercentageInformation?: string;
      energyUseConfidence?: number;
      energyUseConfidencePercentageInformation?: string;
    };
    createdAt?: string;
    documentId?: string;
    providerNetworkType?: string;
    minerIds?: string[];
    emissionIntensityCalculation?: string;
    emissionsScore?: number;
    entityCompany?: string;
    isHistoricData?: boolean;
    globalAverageGridEmissionsFactor?: number;
    globalAverageGridEmissionsFactorSource?: string;
    globalAverageMarginalEmissionFactor?: number;
    globalAverageMarginalEmissionFactorSource?: string;
    globalMarginalEmissionsFactor?: number;
    greenScore?: number;
    greenscoreId?: string;
    gridEmissionsFactor?: string;
    locationScore?: number;
    marginalEmissionsFactor?: number;
    marginalEmissionsIntensity?: number;
    networkMarginalEmissions?: {
      totalNetworkElectricityConsumption?: number;
      totalNetworkRenewableEnergyProduction?: number;
      globalAverageGridEmissionsFactor?: number;
      globalAverageGridEmissionsFactorSource?: string;
      networkMarginalEmissions?: number;
    };
    networkScope2EmissionsCalculation?: {
      estimateCumulativeEnergyUsePerTime?: number;
      averageRawByteCapacityForReportingTime?: number;
      globalAverageGridEmissionsFactor?: number;
      networkAverageRenewableEnergyPurchases?: number;
      networkScope2Emissions?: number;
    };
    normalizedEmissionsIntensity?: number;
    normalizedMarginalEmissionIntensity?: number;
    providerCountry?: string;
    providerCity?: string;
    providerLocationCode?: string;
    providerLocation?: string;
    reportEndDate?: string;
    reportStartDate?: string;
    scope2EmissionsCalculation?: {
      actualNetPowerConsumed?: number;
      gridEmissionsFactor?: number;
      renewableEnergyConsumption?: number;
      averageDataStorageCapacity?: number;
      scope2Emissions?: number;
    };
    status?: number;
    type?: string;
    updatedAt?: string;
    other?: {
      co2StorageBlockCid?: string;
      co2StorageContentCid?: string;
      co2StoragePreviousAssetCid?: string;
      notesOnDataSources?: string;
      informationAboutGreenScoreMeasurementType?: string;
    };
  };
}

const FetchAssetsPage = () => {
  const [evpOutputs, setEVPOutputs] = useState<EVPNode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:10000/api/ceramic/fetch-assets');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {

          // Extract the stream ID directly from the response
          const formattedData = result.data.map((node: any) => ({
            ...node.state.content,
            streamId: node.streamId, // Add the streamId from the parent level
          }));
          setEVPOutputs(formattedData);
          toast.success('Data fetched successfully!');
        } else {
          setError('No data returned');
          toast.error('No data returned');
          
        }
      } else {
        setError('Failed to fetch EVP outputs');
        toast.error('Failed to fetch EVP outputs');
      }
    } catch (err) {
      setError('Error fetching data');
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1>EVP Report Outputs:</h1>
      {error && <p>{error}</p>}
      <ul>
        {evpOutputs.map((node, index) => (
          <li key={index}>
            <hr />
            <h3>Report Information</h3>
            <p><strong>Stream ID:</strong> {node.streamId}</p>
            <p><strong>EVP ID:</strong> {node.evpId}</p>
            <p><strong>Created At:</strong> {node.createdAt}</p>
            
            {node.evpReportDB && (
              <>
                <h4>EVP Report DB</h4>
                <p><strong>Provider Network Type:</strong> {node.evpReportDB.providerNetworkType || 'N/A'}</p>
                <p><strong>Miner IDs:</strong> {node.evpReportDB.minerIds?.join(', ') || 'N/A'}</p>
                <p><strong>Audit Status:</strong> {node.evpReportDB.auditStatus || 'N/A'}</p>
                <p><strong>Entity Company:</strong> {node.evpReportDB.entityCompany || 'N/A'}</p>
                <p><strong>Report Start Date:</strong> {node.evpReportDB.reportStartDate || 'N/A'}</p>
                <p><strong>Report End Date:</strong> {node.evpReportDB.reportEndDate || 'N/A'}</p>
                {node.evpReportDB.locationInformation && (
                  <p>
                    <strong>Location:</strong> {node.evpReportDB.locationInformation.providerCity}, {node.evpReportDB.locationInformation.providerCountry}
                  </p>
                )}
              </>
            )}
            
            {node.greenscoreDB && (
              <>
                <h4>Greenscore DB</h4>
                <p><strong>Green Score:</strong> {node.greenscoreDB.greenScore || 'N/A'}</p>
                <p><strong>Location Score:</strong> {node.greenscoreDB.locationScore || 'N/A'}</p>
                <p><strong>Emissions Score:</strong> {node.greenscoreDB.emissionsScore || 'N/A'}</p>
                <p><strong>Report Start Date:</strong> {node.greenscoreDB.reportStartDate || 'N/A'}</p>
                <p><strong>Report End Date:</strong> {node.greenscoreDB.reportEndDate || 'N/A'}</p>
                <p><strong>Provider City:</strong> {node.greenscoreDB.providerCity || 'N/A'}</p>
                <p><strong>Provider Country:</strong> {node.greenscoreDB.providerCountry || 'N/A'}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchAssetsPage;

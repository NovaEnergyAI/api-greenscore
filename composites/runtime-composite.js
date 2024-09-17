// This is an auto-generated file, do not edit manually
export const definition = {"models":{"NovaEVPAttestationsDB":{"interface":false,"implements":[],"id":"kjzl6hvfrbw6c8ztbd1h3iakeihper9k82odin3z13tbli4yqiwc36oatql4bmm","accountRelation":{"type":"list"}}},"objects":{"AuditReviewDB":{"reportOption":{"type":"float","required":false,"immutable":false},"reviewStatus":{"type":"float","required":false,"immutable":false},"providerEvpStatus":{"type":"float","required":false,"immutable":false},"auditorEvpSubmissionDate":{"type":"string","required":false,"immutable":false},"providerEvpSubmissionDate":{"type":"string","required":false,"immutable":false}},"EVPReportDB":{"type":{"type":"string","required":false,"immutable":false},"minerIds":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"createdAt":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"auditReview":{"type":"reference","refType":"object","refName":"AuditReviewDB","required":false,"immutable":false},"auditStatus":{"type":"float","required":false,"immutable":false},"submittedAt":{"type":"string","required":false,"immutable":false},"greenscoreID":{"type":"string","required":false,"immutable":false},"entityCompany":{"type":"string","required":false,"immutable":false},"reportEndDate":{"type":"string","required":false,"immutable":false},"reportStartDate":{"type":"string","required":false,"immutable":false},"energyProduction":{"type":"reference","refType":"object","refName":"RenewableEnergyProducedDB","required":false,"immutable":false},"waterConsumption":{"type":"reference","refType":"object","refName":"WaterConsumptionDB","required":false,"immutable":false},"locationInformation":{"type":"reference","refType":"object","refName":"LocationInformationDB","required":false,"immutable":false},"providerNetworkType":{"type":"float","required":false,"immutable":false},"hardwareConfiguration":{"type":"reference","refType":"object","refName":"HardwareConfigurationDB","required":false,"immutable":false},"electricityConsumption":{"type":"reference","refType":"object","refName":"ElectricityConsumptionDB","required":false,"immutable":false},"renewableEnergyProcurement":{"type":"reference","refType":"object","refName":"RenewableEnergyProcuredDB","required":false,"immutable":false},"preliminaryResultsRecMatching":{"type":"reference","refType":"object","refName":"PreliminaryResultsRecMatchingDB","required":false,"immutable":false}},"ElectricityConsumptionDB":{"status":{"type":"float","required":false,"immutable":false},"endDate":{"type":"string","required":false,"immutable":false},"reference":{"type":"string","required":false,"immutable":false},"startDate":{"type":"string","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"electricityCompany":{"type":"string","required":false,"immutable":false},"electricityBillFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"estimationMethodology":{"type":"string","required":false,"immutable":false},"annualElectricityUsage":{"type":"string","required":false,"immutable":false},"actualElectricityConsumed":{"type":"string","required":false,"immutable":false},"actualElectricityReturned":{"type":"string","required":false,"immutable":false},"actualElectricityDelivered":{"type":"string","required":false,"immutable":false},"electricityNotPoweringInfrastructure":{"type":"string","required":false,"immutable":false},"totalElectricityUsedForNodeOperations":{"type":"float","required":false,"immutable":false}},"GreenscoreConfidenceScoreDetailsDB":{"nodeIdConfidence":{"type":"float","required":false,"immutable":false},"hardwareConfidence":{"type":"float","required":false,"immutable":false},"locationConfidence":{"type":"float","required":false,"immutable":false},"waterUseConfidence":{"type":"float","required":false,"immutable":false},"energyUseConfidence":{"type":"float","required":false,"immutable":false},"nodeIDConfidencePercentageInformation":{"type":"string","required":false,"immutable":false},"hardwareConfidencePercentageInformation":{"type":"string","required":false,"immutable":false},"waterUseConfidencePercentageInformation":{"type":"string","required":false,"immutable":false},"energyUseConfidencePercentageInformation":{"type":"string","required":false,"immutable":false},"locationInformationPercentageInformation":{"type":"string","required":false,"immutable":false}},"GreenscoreDB":{"type":{"type":"string","required":false,"immutable":false},"other":{"type":"reference","refType":"object","refName":"OtherGreenscoreInformationDB","required":false,"immutable":false},"status":{"type":"float","required":false,"immutable":false},"minerIds":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"createdAt":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"documentId":{"type":"string","required":false,"immutable":false},"greenScore":{"type":"float","required":false,"immutable":false},"greenscoreId":{"type":"string","required":false,"immutable":false},"providerCity":{"type":"string","required":false,"immutable":false},"entityCompany":{"type":"string","required":false,"immutable":false},"locationScore":{"type":"float","required":false,"immutable":false},"reportEndDate":{"type":"string","required":false,"immutable":false},"emissionsScore":{"type":"float","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"confidenceScore":{"type":"float","required":false,"immutable":false},"providerCountry":{"type":"string","required":false,"immutable":false},"reportStartDate":{"type":"string","required":false,"immutable":false},"providerLocation":{"type":"string","required":false,"immutable":false},"gridEmissionsFactor":{"type":"string","required":false,"immutable":false},"providerNetworkType":{"type":"string","required":false,"immutable":false},"providerLocationCode":{"type":"string","required":false,"immutable":false},"confidenceScoreDetails":{"type":"reference","refType":"object","refName":"GreenscoreConfidenceScoreDetailsDB","required":false,"immutable":false},"marginalEmissionsFactor":{"type":"float","required":false,"immutable":false},"networkMarginalEmissions":{"type":"reference","refType":"object","refName":"NetworkMarginalEmissionsDB","required":false,"immutable":false},"benchmarkEmissionIntensity":{"type":"float","required":false,"immutable":false},"marginalEmissionsIntensity":{"type":"float","required":false,"immutable":false},"scope2EmissionsCalculation":{"type":"reference","refType":"object","refName":"Scope2EmissionsCalculationDB","required":false,"immutable":false},"emissionIntensityCalculation":{"type":"string","required":false,"immutable":false},"normalizedEmissionsIntensity":{"type":"float","required":false,"immutable":false},"globalMarginalEmissionsFactor":{"type":"float","required":false,"immutable":false},"globalAverageGridEmissionsFactor":{"type":"float","required":false,"immutable":false},"networkScope2EmissionsCalculation":{"type":"reference","refType":"object","refName":"NetworkScope2EmissionsCalculationDB","required":false,"immutable":false},"benchmarkMarginalEmissionIntensity":{"type":"float","required":false,"immutable":false},"globalAverageMarginalEmissionFactor":{"type":"float","required":false,"immutable":false},"normalizedMarginalEmissionIntensity":{"type":"float","required":false,"immutable":false},"globalAverageGridEmissionsFactorSource":{"type":"string","required":false,"immutable":false},"globalAverageMarginalEmissionFactorSource":{"type":"string","required":false,"immutable":false}},"HardwareConfigurationDB":{"status":{"type":"float","required":false,"immutable":false},"hardware":{"type":"reference","refType":"object","refName":"HardwareDetailsDB","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false}},"HardwareDetailsDB":{"description":{"type":"string","required":false,"immutable":false},"hardwareType":{"type":"string","required":false,"immutable":false},"supportingFile":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"hardwareDetails":{"type":"string","required":false,"immutable":false}},"LocationInformationDB":{"status":{"type":"float","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"providerCity":{"type":"string","required":false,"immutable":false},"entityCompany":{"type":"string","required":false,"immutable":false},"providerState":{"type":"string","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"providerCountry":{"type":"string","required":false,"immutable":false},"providerZipcode":{"type":"string","required":false,"immutable":false},"addressConfirmed":{"type":"boolean","required":false,"immutable":false},"providerLocation":{"type":"string","required":false,"immutable":false}},"NetworkMarginalEmissionsDB":{"networkMarginalEmissions":{"type":"float","required":false,"immutable":false},"globalAverageGridEmissionsFactor":{"type":"float","required":false,"immutable":false},"totalNetworkElectricityConsumption":{"type":"float","required":false,"immutable":false},"totalNetworkRenewableEnergyProduction":{"type":"float","required":false,"immutable":false},"globalAverageGridEmissionsFactorSource":{"type":"string","required":false,"immutable":false}},"NetworkScope2EmissionsCalculationDB":{"networkScope2Emissions":{"type":"float","required":false,"immutable":false},"globalAverageGridEmissionsFactor":{"type":"float","required":false,"immutable":false},"estimateCumulativeEnergyUsePerTime":{"type":"float","required":false,"immutable":false},"averageRawByteCapacityForReportingTime":{"type":"float","required":false,"immutable":false},"networkAverageRenewableEnergyPurchases":{"type":"float","required":false,"immutable":false}},"NovaEVPAttestationsDB":{"type":{"type":"string","required":false,"immutable":false,"indexed":true},"evpId":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"evpReportDB":{"type":"reference","refType":"object","refName":"EVPReportDB","required":false,"immutable":false},"greenscoreDB":{"type":"reference","refType":"object","refName":"GreenscoreDB","required":false,"immutable":false},"organizationId":{"type":"string","required":false,"immutable":false}},"OtherGreenscoreInformationDB":{"co2StorageBlockCid":{"type":"string","required":false,"immutable":false},"notesOnDataSources":{"type":"string","required":false,"immutable":false},"co2StorageContentCid":{"type":"string","required":false,"immutable":false},"co2StoragePreviousAssetCid":{"type":"string","required":false,"immutable":false},"informationAboutGreenScoreMeasurementType":{"type":"string","required":false,"immutable":false}},"PreliminaryResultsRecMatchingDB":{"status":{"type":"float","required":false,"immutable":false},"endDate":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"startDate":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"timePeriod":{"type":"string","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"supportingFile":{"type":"string","required":false,"immutable":false},"totalEmissions":{"type":"float","required":false,"immutable":false},"emissionsFactor":{"type":"float","required":false,"immutable":false},"actualElectricityConsumed":{"type":"string","required":false,"immutable":false},"actualElectricityReturned":{"type":"string","required":false,"immutable":false},"actualElectricityDelivered":{"type":"string","required":false,"immutable":false}},"RenewableEnergyProcuredDB":{"status":{"type":"float","required":false,"immutable":false},"endDate":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"startDate":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"energyUsage":{"type":"boolean","required":false,"immutable":false},"documentFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"supportingFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"renewableEnergyType":{"type":"string","required":false,"immutable":false},"electricityPurchased":{"type":"float","required":false,"immutable":false},"actualElectricityReturned":{"type":"string","required":false,"immutable":false},"actualElectricityDelivered":{"type":"string","required":false,"immutable":false},"renewableEnergyPurchasedFrom":{"type":"string","required":false,"immutable":false},"networkRenewableEnergyPurchases":{"type":"float","required":false,"immutable":false},"networkRenewableElectricityPurchasedDocs":{"type":"string","required":false,"immutable":false},"networkRenewableElectricityPurchasedSource":{"type":"string","required":false,"immutable":false}},"RenewableEnergyProducedDB":{"status":{"type":"float","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"purchaseFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"solarWattPeak":{"type":"string","required":false,"immutable":false},"inspectionDate":{"type":"string","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"inspectionFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}},"solarPanelBrand":{"type":"string","required":false,"immutable":false},"installationDate":{"type":"string","required":false,"immutable":false},"methodOfMeasurement":{"type":"string","required":false,"immutable":false},"numberOfSolarPanels":{"type":"float","required":false,"immutable":false},"electricityPurchased":{"type":"float","required":false,"immutable":false},"renewableEnergyUsage":{"type":"boolean","required":false,"immutable":false},"solarPanelModalNumber":{"type":"string","required":false,"immutable":false},"frequencyOfMeasurement":{"type":"string","required":false,"immutable":false},"totalElectricityControlled":{"type":"float","required":false,"immutable":false},"renewableElectricityPurchased":{"type":"float","required":false,"immutable":false},"networkRenewableEnergyPurchases":{"type":"float","required":false,"immutable":false},"renewableElectricityPurchasedDocs":{"type":"float","required":false,"immutable":false},"renewableElectricityPurchasedSource":{"type":"float","required":false,"immutable":false}},"Scope2EmissionsCalculationDB":{"scope2Emissions":{"type":"float","required":false,"immutable":false},"gridEmissionsFactor":{"type":"float","required":false,"immutable":false},"actualNetPowerConsumed":{"type":"float","required":false,"immutable":false},"averageDataStorageCapacity":{"type":"float","required":false,"immutable":false},"renewableEnergyConsumption":{"type":"float","required":false,"immutable":false}},"WaterConsumptionDB":{"status":{"type":"float","required":false,"immutable":false},"endDate":{"type":"string","required":false,"immutable":false},"createdAt":{"type":"string","required":false,"immutable":false},"reference":{"type":"string","required":false,"immutable":false},"startDate":{"type":"string","required":false,"immutable":false},"updatedAt":{"type":"string","required":false,"immutable":false},"waterUsage":{"type":"boolean","required":false,"immutable":false},"waterCompany":{"type":"string","required":false,"immutable":false},"waterConsumed":{"type":"float","required":false,"immutable":false},"isHistoricData":{"type":"boolean","required":false,"immutable":false},"waterBillFiles":{"type":"list","required":false,"immutable":false,"item":{"type":"string","required":false,"immutable":false}}}},"enums":{},"accountData":{"novaEvpAttestationsDbList":{"type":"connection","name":"NovaEVPAttestationsDB"}}}
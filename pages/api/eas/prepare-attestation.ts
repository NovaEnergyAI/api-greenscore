// import { NextApiRequest, NextApiResponse } from 'next';
// // import { Query } from '@root/data/query';  // Adjust to your actual query handler for DB queries
// // import { transformDatabaseData } from '@root/data/data-transform';  // Assuming you have data transformation utilities
// // import { handleApiError, handleNotFoundError, handleBadRequestError } from './utils/error-handlers';

// /**
//  * API route to prepare attestation data from the database using a Ceramic ID.
//  * 
//  * This endpoint will fetch the attestation data from the database, transform it if necessary,
//  * and return it in the form of an attestation package ready for submission.
//  * 
//  * @param req - The incoming HTTP request containing the ceramicId in the body.
//  * @param res - The HTTP response that will contain the attestation package or an error.
//  */
// export default async function prepareAttestation(req: NextApiRequest, res: NextApiResponse) {
//   console.log('Request received at /api/prepare-attestation');

//   try {
//     // Ensure this is a POST request
//     if (req.method !== 'POST') {
//       res.setHeader('Allow', ['POST']);
//       return res.status(405).end('Method Not Allowed');
//     }

//     const { ceramicId } = req.body;

//     // Check if ceramicId is provided
//     if (!ceramicId) {
//       console.error('Ceramic ID is missing');
//     //   return handleBadRequestError(res, 'Ceramic ID is required');
//     }

//     console.log(`Fetching attestation data for Ceramic ID: ${ceramicId}`);

//     // Fetch attestation data from the database using ceramicId
//     // const documentData = await Query.getOne({ name: 'ceramic_attestations', data: { ceramic_id: ceramicId } });

//     if (!documentData) {
//       console.error(`No attestation found for Ceramic ID: ${ceramicId}`);
//     //   return handleNotFoundError(res, 'Attestation not found');
//     }

//     // // Transform data if necessary for the attestation process
//     // const attestationPackage = transformDatabaseData(documentData);

//     // console.log('Attestation data fetched successfully:', attestationPackage);

//     // Return the prepared attestation package
//     return res.status(200).json({
//       success: true,
//     //   attestationPackage,
//     documentData
//     });
//   } catch (error) {
//     console.error('Error fetching attestation data:', error);
//     // return handleApiError(req, res, error);
//   }
// }

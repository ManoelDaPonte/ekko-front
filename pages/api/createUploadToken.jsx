import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = "WSmgDwwfgT/uPAFaOBEEvo7lZaT56gMrn4dCifd2brIay1TE5apR18OBT4BWS23fG783LNNCBbug+AStxfCA1A==";
const containerName = "fileupload";

export default async function handler(req, res) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    connectionString
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Generate a unique blob name or use the original file name
  const blobName = `${Date.now()}-${req.query.filename}`;

  const blobClient = containerClient.getBlockBlobClient(blobName);

  const sasToken = await blobClient.generateSasUrl(
    {
      permissions: "rw", // Set the appropriate permissions for the SAS token
      expiresOn: new Date(new Date().valueOf() + 86400), // Set the expiration time for the SAS token
    }
  );

  return res.status(200).json({ uploadUrl: sasToken });
}

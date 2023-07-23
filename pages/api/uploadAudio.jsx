import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
https://audiofilestoragetotrans.blob.core.windows.net/fileupload?sp=rw&st=2023-06-16T09:21:56Z&se=2023-06-16T17:21:56Z&spr=https&sv=2022-11-02&sr=c&sig=kTocdiFf3mJEfVFvhXS3NhpH8KWMhAjSx9BDBCnCZrM%3D
const connectionString = "WSmgDwwfgT/uPAFaOBEEvo7lZaT56gMrn4dCifd2brIay1TE5apR18OBT4BWS23fG783LNNCBbug+AStxfCA1A==";
const containerName = "fileupload";

export default async function handler(req, res) {
  const file = req.body.file; // Assuming you're sending the file in the request body

  if (!file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const fileName = `${uuidv4()}-${file.name}`;

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    connectionString
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  try {
    await blockBlobClient.uploadData(file.data, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error uploading file" });
  }
}

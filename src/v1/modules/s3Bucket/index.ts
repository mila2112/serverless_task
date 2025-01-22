import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "../../../utils/logger";

const s3Client = new S3Client({ region: "us-east-1" });

class S3BucketService {

    public async generateSignedUrl(bucketName: string, fileName: string, expiresInSeconds: number = 300): Promise<string> {
        try {
            if (!fileName.endsWith(".csv")) {
                throw new Error("File name must be a .csv file");
            }

            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
            });

            return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
        } catch (error) {
            logger.error(error, "Error generating signed URL:");
            throw new Error("Failed to generate signed URL");
        }
    }

    public async getFileContentAsString(bucketName: string, key: string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            const response = await s3Client.send(command);

            if (!response.Body) {
                throw new Error("File body is empty");
            }

            const fileContent = await response.Body.transformToString();

            logger.info("File content retrieved from S3:", fileContent);

            return fileContent;
        } catch (error) {
            logger.error(error, "Error fetching file content from S3");
            throw new Error("Failed to fetch file content as string");
        }
    }
}

export const s3BucketService = new S3BucketService();




import { S3Event } from "aws-lambda";
import { s3BucketService } from "../modules/s3Bucket";
import { csvRepository } from "../../../db/repositories/CsvRepository";
import { parse } from "csv-parse/sync";
import { logger } from "../../utils/logger";

export const handler = async (event: S3Event): Promise<void> => {
    try {
        const bucketName = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

        logger.info(`Processing file: ${key} from bucket: ${bucketName}`);

        const csvString = await s3BucketService.getFileContentAsString(bucketName, key);

        console.log(csvString);

        const records = parse(csvString, {
            columns: true,
            delimiter: ";",
            skip_empty_lines: true,
            quote: false,
        });

        for (const record of records) {
            await csvRepository.createRecord(record);
        }

        logger.info(`Successfully processed ${records.length} records from file: ${key}`);
    } catch (error) {
        logger.error(error, "Error processing CSV upload");
        throw error;
    }
};

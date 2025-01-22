import { DynamoDBModule } from "../../src/v1/modules/dynamoDB";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../src/utils/logger";

interface CsvRecord {
    [key: string]: any;
}

export class CsvRepository {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async createRecord(data: CsvRecord): Promise<void> {
        try {
            const dynamoDbItem = {
                uuid: uuidv4(),
                ...Object.fromEntries(
                    Object.entries(data).map(([key, value]) => [key, String(value)])
                ),
            };

            await DynamoDBModule.putItem({
                TableName: this.tableName,
                Item: dynamoDbItem,
            });
        } catch (error) {
            logger.error(error, "Error storing record");
            throw error;
        }
    }
}

export const csvRepository = new CsvRepository(process.env.CSV_UPLOADS_TABLE as string);

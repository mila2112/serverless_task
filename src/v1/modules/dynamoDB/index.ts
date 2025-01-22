import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    QueryCommand,
    ScanCommand,
    DeleteCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const DynamoDBModule = {
    async getItem(params: { TableName: string; Key: object }) {
        try {
            const result = await docClient.send(new GetCommand(params));
            return result.Item;
        } catch (error) {
            console.error("Error fetching item:", error);
            throw error;
        }
    },

    async putItem(params: {
        TableName: string;
        Item: Record<string, any>;
    }) {
        try {
            await docClient.send(new PutCommand(params));
        } catch (error) {
            console.error("Error putting item:", error);
            throw error;
        }
    },

    async deleteItem(params: { TableName: string; Key: object }) {
        try {
            await docClient.send(new DeleteCommand(params));
        } catch (error) {
            console.error("Error deleting item:", error);
            throw error;
        }
    },

    async queryItems(params: {
        TableName: string;
        IndexName?: string;
        KeyConditionExpression: string;
        ExpressionAttributeNames?: Record<string, string>;
        ExpressionAttributeValues: Record<string, any>;
    }) {
        try {
            const result = await docClient.send(new QueryCommand(params));
            return result.Items || [];
        } catch (error) {
            console.error("Error querying items:", error);
            throw error;
        }
    },

    async scanTable(params: { TableName: string }) {
        try {
            const result = await docClient.send(new ScanCommand(params));
            return result.Items || [];
        } catch (error) {
            console.error("Error scanning table:", error);
            throw error;
        }
    },
};

export { docClient, DynamoDBModule };




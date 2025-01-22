// @ts-ignore
import { IMessageRepository } from "./interfaces/IMessageRepository";
import { DynamoDBModule } from "../../src/v1/modules/dynamoDB";

class MessageRepository implements IMessageRepository {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }


    async createMessage(data: {
        userName: string;
        userEmail: string;
        passportId: string;
        addresses: { city: string; state: string; zip: string }[];
    }): Promise<void> {
        const { userName, userEmail, passportId, addresses } = data;

        try {
            await DynamoDBModule.putItem({
                TableName: this.tableName,
                Item: {
                    passportId,
                    zip: addresses[0].zip,
                    userName,
                    userEmail,
                    addresses,
                },
            });

            const addressPromises = addresses.map((address) =>
                DynamoDBModule.putItem({
                    TableName: this.tableName,
                    Item: {
                        passportId,
                        zip: address.zip,
                        userName,
                        userEmail,
                        city: address.city,
                        state: address.state,
                    },
                })
            );

            await Promise.all(addressPromises);
        } catch (error) {
            console.error("Error creating message:", error);
            throw error;
        }
    }


    async getByPrimaryKey(passportId: string): Promise<any[]> {
        try {
            return await DynamoDBModule.queryItems({
                TableName: this.tableName,
                KeyConditionExpression: "passportId = :passportId",
                ExpressionAttributeValues: {
                    ":passportId": passportId,
                },
            });
        } catch (error) {
            console.error("Error fetching messages by passportId:", error);
            throw error;
        }
    }

    async getByUserEmail(userEmail: string): Promise<any[]> {
        try {
            return await DynamoDBModule.queryItems({
                TableName: this.tableName,
                IndexName: "UserEmailIndex",
                KeyConditionExpression: "userEmail = :userEmail",
                ExpressionAttributeValues: {
                    ":userEmail": userEmail,
                },
            });
        } catch (error) {
            console.error("Error fetching messages by userEmail:", error);
            throw error;
        }
    }

    async scanMessages(): Promise<any[]> {
        try {
            return await DynamoDBModule.scanTable({
                TableName: this.tableName,
            });
        } catch (error) {
            console.error("Error scanning table:", error);
            throw error;
        }
    }
}

export const messageRepository = new MessageRepository(process.env.MESSAGES_TABLE as string);

import { DynamoDBModule } from "../../src/v1/modules/dynamoDB";
import { v4 as uuidv4 } from "uuid";

interface Address {
    passportId: string;
    city: string;
    state: string;
    zip: string;
}

export class AddressRepository {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async createAddress(data: Address): Promise<void> {
        const { passportId, city, state, zip } = data;

        try {
            await DynamoDBModule.putItem({
                TableName: this.tableName,
                Item: {
                    addressId: uuidv4(),
                    passportId,
                    zip,
                    city,
                    state,
                },
            });

            console.log("Address stored successfully.");
        } catch (error) {
            console.error("Error creating address:", error);
            throw error;
        }
    }
}

export const addressRepository = new AddressRepository(process.env.ADDRESSES_TABLE as string);

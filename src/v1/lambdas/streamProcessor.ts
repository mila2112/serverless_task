import { DynamoDBStreamEvent, DynamoDBStreamHandler } from "aws-lambda";
import { logger } from "../../utils/logger";
import { addressRepository } from "../../../db/repositories/AddressRepository";

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info("DynamoDB stream triggered");
    for (const record of event.Records) {
        if (record.eventName === "INSERT") {
            const newImage = record.dynamodb?.NewImage;

            if (newImage) {
                const passportId = newImage.passportId.S;
                const addresses = newImage.addresses.L.map((address: any) => ({
                    city: address.M.city.S,
                    state: address.M.state.S,
                    zip: address.M.zip.S,
                }));

                const addressPromises = addresses.map((address) =>
                        addressRepository.createAddress({
                            passportId,
                            city: address.city,
                            state: address.state,
                            zip: address.zip,
                        })
                    );

                try {
                    await Promise.all(addressPromises);
                    logger.info("Addresses added successfully to the Addresses table.");
                } catch (error) {
                    logger.error("Error adding addresses to the Addresses table", { error });
                    throw new Error("Failed to insert address into Addresses table.");
                }
            }
        }
    }
};


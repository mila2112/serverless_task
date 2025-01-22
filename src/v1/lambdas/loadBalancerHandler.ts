import { SQSEvent } from "aws-lambda";
import { messageRepository } from "../../../db/repositories/MessageRepository";
import { logger } from "../../utils/logger";

export const handler = async (event: SQSEvent) => {
    logger.info("loadBalancerHandler invoked");

    for (const record of event.Records) {
        const body = JSON.parse(record.body);

        if (!body) {
            logger.warn("Message is required");
            continue;
        }

        const { userName, userEmail, passportId, addresses } = body;

        if (!userName || !userEmail || !passportId || !addresses) {
            logger.warn("Missing required fields in message", { body });
            continue;
        }

        const messageData = {
            userName,
            userEmail,
            passportId,
            addresses,
        };

        try {
            await messageRepository.createMessage(messageData);
            logger.info("Message stored successfully");
        } catch (error) {
            logger.error(error, "Error storing message");
            throw error;
        }
    }
};














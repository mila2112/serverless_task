import { APIGatewayProxyEvent } from "aws-lambda";
import { messageRepository } from "../../../db/repositories/MessageRepository";
import { logger } from "../../utils/logger";
import { createResponse, createErrorResponse } from "../../helpers/response.modifier";

export const handler = async (event: APIGatewayProxyEvent) => {
    const { userEmail } = event.queryStringParameters || {};

    try {
        const messages = await messageRepository.getByUserEmail(userEmail);
        return createResponse(200, { messages });
    } catch (error) {
        logger.error(error, "Error fetching messages by userEmail");
        throw error;
    }
};

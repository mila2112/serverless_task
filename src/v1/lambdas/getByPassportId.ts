import { APIGatewayProxyEvent } from "aws-lambda";
import { messageRepository } from "../../../db/repositories/MessageRepository";
import { logger } from "../../utils/logger";
import { createResponse, createErrorResponse } from "../../helpers/response.modifier";

export const handler = async (event: APIGatewayProxyEvent) => {
    const { passportId } = event.pathParameters || {};

    try {
        const messages = await messageRepository.getByPrimaryKey(passportId);
        return createResponse(200, { messages });
    } catch (error) {
        logger.error(error, "Error fetching messages by passportId");
        throw error;
    }
};




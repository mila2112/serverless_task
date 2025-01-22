import { APIGatewayProxyHandler } from "aws-lambda";
import {messageRepository} from "../../../db/repositories/MessageRepository";
import { logger } from "../../utils/logger";
import { createResponse } from "../../helpers/response.modifier";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const messages = await messageRepository.scanMessages();

        return createResponse(200, { messages });
    } catch (error) {
        logger.error("Error scanning table", { error });
        throw error;
    }
};

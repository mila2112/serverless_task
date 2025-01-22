import { APIGatewayProxyHandler } from "aws-lambda";
import { s3BucketService } from "../modules/s3Bucket";
import { createResponse } from "../../helpers/response.modifier";

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const { fileName } = JSON.parse(event.body || "{}");

        if (!fileName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "File name is required" }),
            };
        }

        const signedUrl = await s3BucketService.generateSignedUrl(process.env.CSV_BUCKET!, fileName);

        return createResponse(200, { signedUrl });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

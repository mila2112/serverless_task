export const createResponse = (statusCode: number, body: object) => ({
    statusCode,
    body: JSON.stringify(body),
});

export const createErrorResponse = (statusCode: number, message: string) => ({
    statusCode,
    body: JSON.stringify({ message }),
});
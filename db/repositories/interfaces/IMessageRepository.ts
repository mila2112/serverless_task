interface IMessageRepository {
    createMessage(data: {
        messageId: string;
        userName: string;
        userEmail: string;
        passportId: string;
        addresses: {
            city: string;
            state: string;
            zip: string;
        }[];
    }): Promise<void>;

    getMessageById(messageId: string): Promise<{
        messageId: string;
        userName: string;
        userEmail: string;
        passportId: string;
        addresses: {
            city: string;
            state: string;
            zip: string;
        }[];
    } | null>;
}


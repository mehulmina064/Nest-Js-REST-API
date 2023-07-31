export declare class WhatsappService {
    constructor();
    sendText(Text: any, contact: any): Promise<any>;
    sendMultiText(Text: string, contact: any): Promise<any>;
    rfqBidMessage(name: any, contact: any, templateName: any, rfqId: any): Promise<{
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    }>;
    sendInstructions(contact: any, doc_link: any): Promise<{
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    }>;
    sendTemplateMessage(name: any, contact: any, templateName: any, doc_link?: any, doc_name?: any, img_link?: any, video_link?: any, form_link?: any): Promise<{
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    }>;
    sendManufacture(name: any, contact: any, doc_link: any, doc_name: any): Promise<{
        error: string;
        contact: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
    }>;
    sendBulkManufacture(body: any): Promise<{
        message: string;
        status: number;
        Response?: undefined;
    } | {
        Response: ({
            error: string;
            contact: any;
            message_ids?: undefined;
        } | {
            message_ids: any;
            contact: any;
            "error"?: undefined;
        })[];
        message: string;
        status: number;
    }>;
    formateContacts(contacts: any): Promise<false | {
        "contacts": {
            "name": string;
            "contact": number;
        }[];
        "document_link": string;
        "document_name": string;
    }>;
    sendTemplateMessageManufacturers(contact: any, templateName: any, image_link: any): Promise<{
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    }>;
}

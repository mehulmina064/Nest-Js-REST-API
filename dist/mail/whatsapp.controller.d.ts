import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    sendText(body: any): Promise<{
        message: string;
        status: number;
        Response?: undefined;
    } | {
        Response: any[];
        message: string;
        status?: undefined;
    }>;
    multiText(body: any): Promise<{
        message: string;
        status: number;
        Response?: undefined;
    } | {
        Response: any[];
        message: string;
        status?: undefined;
    }>;
    rfqBidMessage(body: any): Promise<{
        message: string;
        status: number;
        Response?: undefined;
    } | {
        Response: ({
            error: string;
            contact: any;
            message: any;
            message_ids?: undefined;
        } | {
            message_ids: any;
            contact: any;
            "error"?: undefined;
            message?: undefined;
        })[];
        message: string;
        status: number;
    }>;
    sendTemplateMessage(body: any): Promise<{
        message: string;
        status: number;
        Response?: undefined;
    } | {
        Response: ({
            error: string;
            contact: any;
            message: any;
            message_ids?: undefined;
        } | {
            message_ids: any;
            contact: any;
            "error"?: undefined;
            message?: undefined;
        })[];
        message: string;
        status: number;
    }>;
    sendBulkManufacture(file: any, document_link: any, document_name: any): Promise<{
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
}

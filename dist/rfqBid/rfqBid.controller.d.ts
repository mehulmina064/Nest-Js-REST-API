import { rfqBidService } from './rfqBid.service';
export declare class rfqBidController {
    private readonly rfqBidService;
    constructor(rfqBidService: rfqBidService);
    getAll(): Promise<import("./rfqBid.entity").rfqBid[]>;
    getManufacturersSheetDetails(): Promise<{
        statusCode: number;
        message: string;
        data: {
            'manufacturerNo': number;
            'companyName': any;
            'poc': any;
            'category': any;
            'pinCode': any;
            'email': any;
            'mobileNo': any;
            'state': any;
            'city': any;
            'typeOfBusiness': any;
            'address': any;
        }[];
    }>;
    sendMailManufacturersSurvery(): Promise<string[]>;
    sendMailManufacturersWithTemplate(body: any): Promise<string[]>;
    sendWhatsappMessaageManufacturersWithTemplate(body: any): Promise<({
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    })[]>;
    getAllRfqDetails(): Promise<any>;
    getAllRfqBidsDetails(): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getOneRfqBidsDetails(id: string): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAnySheetDetails(id: string, range: string): Promise<{
        no: number;
    }[]>;
    RfqDetails(id: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            "name": string;
            "id": any;
            "owner": any;
            "description": any;
            "lineItems": {
                'productNo': number;
                'productName': any;
                'rfqQuantity': any;
                'units': any;
                'specifications': any;
                'category': any;
                'targetPrice': any;
                'salesComment': any;
                'opsRemark': any;
            }[];
        };
    }>;
    getRfqDetails(id: string): Promise<{
        statusCode: number;
        message: string;
        data: {
            "name": string;
            "id": any;
            "owner": any;
            "description": any;
            "lineItems": {
                'productNo': number;
                'productName': any;
                'rfqQuantity': any;
                'units': any;
                'specifications': any;
                'category': any;
                'targetPrice': any;
                'salesComment': any;
                'opsRemark': any;
            }[];
        };
    }>;
    getRfqBidDetails(id: string, data: any): Promise<{
        FormData: any;
        rfqDetails: {
            "name": string;
            "id": any;
            "owner": any;
            "description": any;
            "lineItems": {
                'productNo': number;
                'productName': any;
                'rfqQuantity': any;
                'units': any;
                'specifications': any;
                'category': any;
                'targetPrice': any;
                'salesComment': any;
                'opsRemark': any;
            }[];
        };
        sheetSaveDetails: {
            rfqSheetDetails: any;
        };
        statusCode: number;
        message: string;
    }>;
    getRfqSheetDetails(id: string): Promise<{
        'productNo': number;
        'productName': any;
        'rfqQuantity': any;
        'units': any;
        'specifications': any;
        'category': any;
        'targetPrice': any;
        'salesComment': any;
        'opsRemark': any;
    }[]>;
    rfqSendToManufacturers(id: string): Promise<({
        email: string[];
        wahtsapp?: undefined;
    } | {
        wahtsapp: ({
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
        email?: undefined;
    })[]>;
    rfqSendWhstappInstruction(): Promise<({
        error: string;
        contact: any;
        message: any;
        message_ids?: undefined;
    } | {
        message_ids: any;
        contact: any;
        "error"?: undefined;
        message?: undefined;
    })[]>;
}

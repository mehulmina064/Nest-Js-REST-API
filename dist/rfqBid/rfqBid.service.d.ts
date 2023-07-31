import { MailService } from './../mail/mail.service';
import { WhatsappService } from './../mail/whatsapp.service';
import { zohoToken } from './../sms/token.entity';
import { Repository } from 'typeorm';
import { rfqBid } from './rfqBid.entity';
export declare class rfqBidService {
    private readonly mailService;
    private readonly whatsappService;
    private readonly zohoTokenRepository;
    private readonly rfqBidRepository;
    constructor(mailService: MailService, whatsappService: WhatsappService, zohoTokenRepository: Repository<zohoToken>, rfqBidRepository: Repository<rfqBid>);
    getAll(): Promise<rfqBid[]>;
    saveRfqBid(rfqBid: any): Promise<any>;
    sheetBidSave(rfq: any, rfqBid: any): Promise<{
        rfqSheetDetails: any;
    }>;
    mapResearchData(data: any, sheetId: any): Promise<any>;
    saveRfqSheetDetails(sheetId: any, rfqBid: any): Promise<any>;
    saveCrmRfqBid(rfqBid: any): Promise<false | {
        Name: string;
        RFQ_ID: {
            id: any;
        };
        RFQ_Bid_Date: Date;
        RFQ_Bid_No: string;
        GST_Number: any;
        Manufacturer_Email: any;
        Manufacturer_Phone: any;
        Line_Items: string;
        Comment: any;
    }[]>;
    zohoCrmToken(): Promise<any>;
    newZohoCrmToken(): Promise<string>;
    getAllCrmRfqDetails(): Promise<any>;
    getAllCrmRfqBidsDetails(): Promise<any>;
    getOneCrmRfqBidsDetails(id: string): Promise<any>;
    getOneCrmRfqDetails(id: string): Promise<any>;
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
    getRfqDetails(rfqId: string): Promise<{
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
    RfqDetails(rfqId: string): Promise<{
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
    getAnySheetDetails(sheetId: any, sheetRange: any): Promise<{
        no: number;
    }[]>;
    getManufacturersSheetDetails(sheetId: any, sheetRange: any): Promise<{
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
    }[]>;
    getRfqSheetDetails(sheetId: any, sheetRange: any): Promise<{
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
    getManufacturersDetails(): Promise<{
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
    rfqSendToManufacturers(lineItems: any): Promise<{
        'category': any;
        'lineItems': any[];
        'manufactureEmail': never[];
        'count': number;
    }[]>;
    sendMail(itemData: any, rfqId: string): Promise<string[]>;
    sendMailManufacturersSurvery(): Promise<string[]>;
    sendMailManufacturersWithTemplate(templateName: any, subject: any): Promise<string[]>;
    sendWhatsappMessaageManufacturersWithTemplate(templateName: any, image_link?: any): Promise<({
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
    sendWhatsappBid(rfqId: any): Promise<({
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
    sendWhatsappInstruction(): Promise<({
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

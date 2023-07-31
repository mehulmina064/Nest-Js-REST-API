import { Repository } from 'typeorm';
import { Manufacture } from './manufacture.entity';
import { zohoToken } from './../sms/token.entity';
export declare class ManufactureService {
    private readonly manufactureRepository;
    private readonly zohoTokenRepository;
    constructor(manufactureRepository: Repository<Manufacture>, zohoTokenRepository: Repository<zohoToken>);
    findAll(): Promise<Manufacture[]>;
    findOne(id: string): Promise<Manufacture>;
    findByGstNo(gstNo: string): Promise<any>;
    zohoBookToken(): Promise<any>;
    newzohoBookToken(): Promise<string>;
    pimcoreManufacturerData(): Promise<any>;
    zohoManufacturerData(): Promise<any>;
    singleZohoManufacturerData(id: string): Promise<any>;
    saveToProdo(arrdata: any): Promise<{
        statusCode: number;
        status: string;
        message: string;
        data: {
            saved: {
                status: string;
                pimId: string | undefined;
                prodoId: import("typeorm").ObjectID;
                message: string;
            }[];
            updated: {
                status: string;
                data: string | undefined;
                pimId: string | undefined;
                prodoId: import("typeorm").ObjectID;
                message: string;
            }[];
            error: {
                status: string;
                pimId: any;
                message: string;
            }[];
        };
    }>;
    mapZohoData(data: Manufacture): Promise<{
        "record_name": string;
        "cf_company_name": string;
        "cf_pan": string;
        "cf_gstin": string;
        "cf_gst_treatment": string;
        "cf_primary_categories": string;
        "cf_main_contact_person": string;
        "cf_main_contact_email": string;
        "cf_main_contact_mobile": string;
        "cf_standard_payment_teams": string;
        "cf_bank_name": string;
        "cf_bank_account_no": string | number;
        "cf_bank_branch": string;
        "cf_bank_ifsc_code": string;
        "cf_account_type": string;
        "cf_annual_turnover_in_lacs": string | number;
        "cf_ready_for_full_scale_audit": string;
        "cf_address_1": string;
        "cf_address_2": string;
        "cf_region_code": string;
        "cf_prodo_id": string | import("typeorm").ObjectID;
        "cf_manufacturing_partner_id": any;
        "cf_company_email_address": any;
        "cf_status": any;
        "cf_website": any;
        "cf_cancelled_cheque_or_bank_a_": any;
        "cf_pan_copy": any;
        "cf_gst_certificate": any;
        "cf_skus": any;
        "cf_certification_attachements": any;
        "cf_prodo_certification": any;
        "cf_annual_rate_contract": any;
        "cf_attention": any;
        "cf_country": any;
        "cf_state": any;
        "cf_pin_code": any;
        "cf_phone": any;
        "cf_google_maps_link": any;
        "cf_latitude": any;
        "cf_longitude": any;
        "cf_first_name": string;
        "cf_last_name": string;
        "cf_email": string;
        "cf_work_phone": string;
        "cf_mobile": any;
        "cf_designation": string;
        "cf_department": any;
    }>;
    saveToZoho(arrdata: any): Promise<{
        statusCode: number;
        status: string;
        message: string;
        data: {
            saved: {
                status: string;
                pimId: any;
                prodoId: any;
                message: string;
            }[];
            updated: {
                status: string;
                data: any;
                pimId: any;
                prodoId: any;
                message: string;
            }[];
            error: any[];
        };
    }>;
    saveManufacturerToZohoBooks(manufacture: any): Promise<any>;
    updateManufacturerToZohoBooks(manufacture: any, zohoId: any): Promise<any>;
}

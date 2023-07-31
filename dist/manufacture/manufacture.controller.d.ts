import { ManufactureService } from './manufacture.service';
import { Manufacture } from './manufacture.entity';
export declare class ManufactureController {
    private readonly manufactureService;
    constructor(manufactureService: ManufactureService);
    prodoData(): Promise<{
        message: string;
        status: number;
        data: Manufacture[];
    }>;
    gstVerify(gstNo: string): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
    singleManufacturer(id: string): Promise<Manufacture>;
    zohoData(): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
    zohosingleData(id: string): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
    pimcoreData(): Promise<{
        message: string;
        status: number;
        data: any;
    }>;
    saveManufacturerToZohoBooks(data: any): Promise<any>;
    updateManufacturerToZohoBooks(id: string, data: any): Promise<any>;
    saveToProdo(): Promise<{
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
    saveToZoho(): Promise<{
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
}

import { Repository } from 'typeorm';
import { Gst } from './gst.entity';
import { HSNCode } from './hsn.entity';
import { SACCode } from './sac.entity';
export declare class GstService {
    private readonly gstRepository;
    private readonly hsnCodeRepository;
    private readonly sacCodeRepository;
    findAll(): Promise<Gst[]>;
    findOne(id: string): Promise<any>;
    save(gst: Gst): Promise<Gst>;
    remove(id: string): Promise<Gst>;
    filter(filter: any): Promise<Gst[]>;
    update(id: string, gst: any): Promise<import("typeorm").UpdateResult>;
    bulkInsertFromExcelHSNSAC(file: any): Promise<{
        "message": string;
    }>;
    bulkInsertFromExcelGST(file: any): Promise<{
        'message': string;
    }>;
    findByHSNCode(hsnCode: string): Promise<Gst>;
    findByHSNCode4Digit(hsnCode4Digit: string): Promise<Gst>;
    SearchHSNSACCodeByDescription(description: string): Promise<any>;
    SearchDescriptionFromHsnCode(hsnCode: string): Promise<any>;
    constructor(gstRepository: Repository<Gst>, hsnCodeRepository: Repository<HSNCode>, sacCodeRepository: Repository<SACCode>);
}

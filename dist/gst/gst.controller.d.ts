import { GstService } from './gst.service';
import { Gst } from './gst.entity';
export declare class GstController {
    private readonly gstService;
    constructor(gstService: GstService);
    findAll(): Promise<Gst[]>;
    findOne(id: string): Promise<Gst>;
    save(gst: Gst): Promise<Gst>;
    remove(id: string): Promise<Gst>;
    update(id: string, gst: Gst): Promise<Gst>;
    bulkUploadFromExcel(file: any, type: string): Promise<any>;
    searchHSNCode(query: any): Promise<any>;
    getGSTCode(query: any): Promise<any>;
}

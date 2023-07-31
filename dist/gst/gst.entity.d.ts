import { ObjectID } from 'typeorm';
export declare class Gst {
    id: ObjectID;
    hsnCode: string;
    hsnCode4Digit: string;
    nameOfCommodity: string;
    gstRate: number;
    schedule: string;
    chapterNo: string;
    gstType: string;
    gstApplicable: string;
    gstApplicableOn: string;
}

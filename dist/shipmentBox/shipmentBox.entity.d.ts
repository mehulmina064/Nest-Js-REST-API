import { ObjectID } from 'typeorm';
export declare class ShipmentBox {
    id: ObjectID;
    boxId: number;
    boxName: string;
    boxWeight: number;
    boxVolume: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxWeightUnit: string;
    boxVolumeUnit: string;
    boxLengthUnit: string;
    boxWidthUnit: string;
    boxHeightUnit: string;
    boxDescription: string;
    boxType: string;
    boxTypeDescription: string;
    boxTypeCode: string;
    boxTypeCodeDescription: string;
    items: [];
}

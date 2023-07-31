import { ItemDto } from "../item/item.dto";
export declare class ShipmentBoxDto {
    id: string;
    shipmentId: number;
    boxId: number;
    boxName: string;
    boxType: string;
    boxWeight: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxVolume: number;
    boxWeightUnit: string;
    boxDimensionUnit: string;
    boxVolumeUnit: string;
    boxStatus: string;
    items: ItemDto[];
}
export declare class ShipmentBoxCreateDto {
    shipmentId: number;
    boxId: number;
    boxName: string;
    boxType: string;
    boxWeight: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxVolume: number;
    boxWeightUnit: string;
    boxDimensionUnit: string;
    boxVolumeUnit: string;
    boxStatus: string;
    boxCreatedDate: Date;
    boxUpdatedDate: Date;
    boxCreatedBy: string;
    boxUpdatedBy: string;
}
export declare class ShipmentBoxUpdateDto {
    id: string;
    shipmentId: number;
    boxId: number;
    boxName: string;
    boxType: string;
    boxWeight: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxVolume: number;
    boxWeightUnit: string;
    boxDimensionUnit: string;
    boxVolumeUnit: string;
    boxStatus: string;
    boxCreatedDate: Date;
    boxUpdatedDate: Date;
    boxCreatedBy: string;
    boxUpdatedBy: string;
}
export declare class ShipmentBoxDeleteDto {
    id: string;
    shipmentId: number;
    boxId: number;
    boxName: string;
    boxType: string;
    boxWeight: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxVolume: number;
    boxWeightUnit: string;
    boxDimensionUnit: string;
    boxVolumeUnit: string;
    boxStatus: string;
    boxCreatedDate: Date;
    boxUpdatedDate: Date;
    boxCreatedBy: string;
    boxUpdatedBy: string;
}
export declare class ShipmentBoxListDto {
    id: string;
    shipmentId: number;
    boxId: number;
    boxName: string;
    boxType: string;
    boxWeight: number;
    boxLength: number;
    boxWidth: number;
    boxHeight: number;
    boxVolume: number;
    boxWeightUnit: string;
    boxDimensionUnit: string;
    boxVolumeUnit: string;
    boxStatus: string;
    boxCreatedDate: Date;
    boxUpdatedDate: Date;
    boxCreatedBy: string;
    boxUpdatedBy: string;
}

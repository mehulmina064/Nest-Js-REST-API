// create all DTO classes here for the shipmentBox module take fields from shipmentBox.entity.ts

import { ItemDto } from "../item/item.dto";

export class ShipmentBoxDto {
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
  
export class ShipmentBoxCreateDto {
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
export class ShipmentBoxUpdateDto {
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
export class ShipmentBoxDeleteDto {
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
export class ShipmentBoxListDto {
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
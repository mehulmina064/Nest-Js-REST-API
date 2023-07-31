import { BaseAppEntity } from "./base-app.entity";
export declare class OrganizationModel extends BaseAppEntity {
    organization_id: string;
    territory_id: string[];
    namingScheme: string;
    serialNumber: string;
    barcode: string;
    barcodeType: string;
}

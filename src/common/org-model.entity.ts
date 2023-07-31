import { ApiModelProperty } from "@nestjs/swagger";
import { Column, ObjectID } from "typeorm";
import { BaseAppEntity } from "./base-app.entity";

export class OrganizationModel extends BaseAppEntity {

    @ApiModelProperty()
    @Column()
    organization_id!: string;

    @ApiModelProperty()
    @Column()
    territory_id: string[] = [];
    
    @ApiModelProperty()
    @Column()
    namingScheme!: string;

    @ApiModelProperty()
    @Column()
    serialNumber!: string;


    @ApiModelProperty()
    @Column()
    barcode!: string;

    @ApiModelProperty()
    @Column()
    barcodeType!: string;

}
    
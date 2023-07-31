 import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { ObjectID, Entity, ObjectIdColumn, Column} from "typeorm";
@Entity('Manufacture')
export class Manufacture {

    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelPropertyOptional()
    @Column()
    pimId: string | undefined;

    @ApiModelPropertyOptional()
    @Column()
    zohoId: string | undefined;
  
    @ApiModelPropertyOptional()
    @Column()
    firstName?: string | '';
  
    @ApiModelProperty()
    @Column()
    lastName?: string | '';

    @ApiModelProperty()
    @Column()
    companyName: string | undefined;

    @ApiModelProperty()
    @Column()
    email: string | undefined;

    @ApiModelProperty()
    @Column()
    Address1: string | undefined;


    @ApiModelProperty()
    @Column()
    Address2: string | undefined;


    @ApiModelProperty()
    @Column()
    WorkPhone: string | undefined;

    @ApiModelProperty()
    @Column()
    bankName: string | undefined;
    
    @ApiModelProperty()
    @Column()
    bankBranch: string | undefined;

    @ApiModelProperty()
    @Column()
    bankIFSC: string | undefined;

    @ApiModelProperty()
    @Column()
    bankAccountNo: number | undefined;

    @ApiModelProperty()
    @Column()
    PAN: string | undefined;

    @ApiModelProperty()
    @Column()
    city: string | undefined;

    @ApiModelProperty()
    @Column()
    country: string | undefined;

    @ApiModelProperty()
    @Column()
    GSTIN: string | undefined;

    @ApiModelProperty()
    @Column()
    latitude: string | undefined;

    @ApiModelProperty()
    @Column()
    longitude: string | undefined;

    @ApiModelProperty()
    @Column()
    gMapsLink: string | undefined;

    @ApiModelProperty()
    @Column()
    primaryCategory?: string[] | [];

    @ApiModelProperty()
    @Column()
    productCategories?: string[] | [];

    @ApiModelProperty()
    @Column()
    annualTurnover: number | undefined;
    
    @ApiModelProperty()
    @Column()
    designation: string | undefined;

    @ApiModelProperty()
    @Column()
    FSAuditReady: string | undefined;

    @ApiModelProperty()
    @Column()
    accountType: string | undefined;

    @ApiModelProperty()
    @Column()
    standardPaymentTerms: string | undefined;

    @ApiModelProperty()
    @Column()
    regionCode: string | undefined;

    @ApiModelProperty()
    @Column()
    GSTTreatment: string | undefined;

    @ApiModelProperty()
    @Column()
    vendorID: string | undefined;

    @ApiModelProperty()
    @Column()
    mainContactPerson: string | undefined;

    @ApiModelProperty()
    @Column()
    mainContactEmail: string | undefined;

    @ApiModelProperty()
    @Column()
    mainContactMobile: string | undefined;

}


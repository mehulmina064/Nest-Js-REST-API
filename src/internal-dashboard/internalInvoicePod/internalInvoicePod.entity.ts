import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';

export enum podType {
    // POD Type
    Signed = 'Signed Invoice',
    Digital = 'Digital Signature with Receiver Photo',
}

@Entity('invoicePod')
export class invoicePod extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
  
    @ApiModelProperty()
    @Column()
    zohoInvoiceId: string | undefined;

    @ApiModelProperty()
    @Column()
    zohoSalesOrderId: string | undefined;

    @ApiModelProperty()
    @Column()
    validity: number | undefined;
  
    @ApiModelProperty()
    @Column({ 
        type: 'enum',
        enum: podType,
        default: podType.Digital,
    })
    podType: podType | undefined;

    @ApiModelProperty()
    @Column()
    signatureFile: string | undefined;

    @ApiModelProperty()
    @Column()
    podLocation: string | undefined;

    @ApiModelProperty()
    @Column()
    pod1: string | undefined;

    @ApiModelProperty()
    @Column()
    pod2: string | undefined;

    @ApiModelProperty()
    @Column()
    otherAttachmentLinks: string[] = [];
   
}

import { DocumentStatus } from './../document/document-status.entity';
import { Payments } from './payments.entity';
import { Entity, ObjectID,ObjectIdColumn,Column } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
@Entity('PaymentTerms')
export class PaymentTerms {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;
    
    @ApiModelProperty()
    @Column()
    paymentTerm: string;

    @ApiModelProperty()
    @Column()
    paymentTermDescription: string;
    @ApiModelProperty()
    @Column()
    paymentTermCode: string;

    @ApiModelProperty()
    @Column()
    paymentTermType: string;

    @ApiModelProperty()
    @Column()
    document_id: string;

    @ApiModelProperty()
    @Column()
    due_date: Date;

    @ApiModelProperty()
    @Column()
    payments_emis: Payments[] = [];

    @ApiModelProperty()
    @Column()
    purchase_order: string;

    @ApiModelProperty()
    @Column()
    supplychain_id: string; 
    
    @ApiModelProperty()
    @Column()
    statusHistory: DocumentStatus[] = [];
}

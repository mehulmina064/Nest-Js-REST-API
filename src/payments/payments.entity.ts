// Create NestJS TypeORM Entity to record payment history

import { Entity, ObjectID,ObjectIdColumn,Column } from "typeorm";
import { ApiModelProperty } from "@nestjs/swagger";
import { OrganizationModel } from "../common/org-model.entity";
export enum PaymentStatus {
    PAID = 'PAID',
    UNPAID = 'UNPAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

@Entity('payments')
export class Payments extends OrganizationModel {
    // Create all necessary fields for payments
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column()
    userId: string;

    @ApiModelProperty()
    @Column()
    amount: string;

    @ApiModelProperty()
    @Column()
    recipient: string;

    @ApiModelProperty()
    @Column()
    sender_org: string;

    @ApiModelProperty()
    @Column()
    reciever_org: string;

    @ApiModelProperty()
    @Column()
    currency: string;

    @ApiModelProperty()
    @Column()
    dueDate: Date;

    @ApiModelProperty()
    @Column()
    paymentMethod: string;

    @ApiModelProperty()
    @Column({ enum: PaymentStatus, default: PaymentStatus.UNPAID })
    paymentStatus: PaymentStatus;

    @ApiModelProperty()
    @Column()
    paymentDate: string;

    @ApiModelProperty()
    @Column()
    paymentId: string;

    @ApiModelProperty()
    @Column()
    paymentGateway: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayId: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayResponse: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayResponseCode: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayResponseMessage: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayResponseRaw: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayResponseStatus: string;

    // Create all necessary fields for payments
}

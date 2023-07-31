import { ApiModelProperty } from "@nestjs/swagger";
import { ObjectIdColumn, Column, ObjectID ,Entity } from "typeorm";
import { OrganizationModel } from "../common/org-model.entity";


export class PaymentGatewayAccount {

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountId: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountName: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountNumber: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountType: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountCurrency: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountBalance: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountStatus: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountCreatedAt: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountUpdatedAt: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountCreatedBy: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccountUpdatedBy: string;

}



@Entity("paymentGateway")
export class PaymentGateway extends OrganizationModel {
    // Create all necessary fields for paymentGateway
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    //fields for registering a Payment Gateway
    @ApiModelProperty()
    @Column()
    paymentGatewayName: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayDescription: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayCode: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayType: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayStatus: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayUrl: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayUsername: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayPassword: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayToken: string;

    @ApiModelProperty()
    @Column()
    paymentGatewaySecret: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayPublicKey: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayPrivateKey: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayLogo: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFee: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeType: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeCurrency: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeePercentage: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeFixed: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeMin: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeMax: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeMinAmount: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayFeeMaxAmount: string;

    @ApiModelProperty()
    @Column()
    paymentGatewayAccount:PaymentGatewayAccount;

    

}

import { ObjectID } from "typeorm";
import { OrganizationModel } from "../common/org-model.entity";
export declare class PaymentGatewayAccount {
    paymentGatewayAccountId: string;
    paymentGatewayAccountName: string;
    paymentGatewayAccountNumber: string;
    paymentGatewayAccountType: string;
    paymentGatewayAccountCurrency: string;
    paymentGatewayAccountBalance: string;
    paymentGatewayAccountStatus: string;
    paymentGatewayAccountCreatedAt: string;
    paymentGatewayAccountUpdatedAt: string;
    paymentGatewayAccountCreatedBy: string;
    paymentGatewayAccountUpdatedBy: string;
}
export declare class PaymentGateway extends OrganizationModel {
    id: ObjectID;
    paymentGatewayName: string;
    paymentGatewayDescription: string;
    paymentGatewayCode: string;
    paymentGatewayType: string;
    paymentGatewayStatus: string;
    paymentGatewayUrl: string;
    paymentGatewayUsername: string;
    paymentGatewayPassword: string;
    paymentGatewayToken: string;
    paymentGatewaySecret: string;
    paymentGatewayPublicKey: string;
    paymentGatewayPrivateKey: string;
    paymentGatewayLogo: string;
    paymentGatewayFee: string;
    paymentGatewayFeeType: string;
    paymentGatewayFeeCurrency: string;
    paymentGatewayFeePercentage: string;
    paymentGatewayFeeFixed: string;
    paymentGatewayFeeMin: string;
    paymentGatewayFeeMax: string;
    paymentGatewayFeeMinAmount: string;
    paymentGatewayFeeMaxAmount: string;
    paymentGatewayAccount: PaymentGatewayAccount;
}

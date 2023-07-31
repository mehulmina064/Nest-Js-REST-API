import { ObjectID } from "typeorm";
import { OrganizationModel } from "../common/org-model.entity";
export declare enum PaymentStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare class Payments extends OrganizationModel {
    id: ObjectID;
    userId: string;
    amount: string;
    recipient: string;
    sender_org: string;
    reciever_org: string;
    currency: string;
    dueDate: Date;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    paymentDate: string;
    paymentId: string;
    paymentGateway: string;
    paymentGatewayId: string;
    paymentGatewayResponse: string;
    paymentGatewayResponseCode: string;
    paymentGatewayResponseMessage: string;
    paymentGatewayResponseRaw: string;
    paymentGatewayResponseStatus: string;
}

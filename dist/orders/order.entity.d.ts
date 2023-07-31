import { ObjectID } from 'typeorm';
import { Tracking } from '../tracking/tracking.entity';
import { OrganizationModel } from '../common/org-model.entity';
export declare class Order extends OrganizationModel {
    id: ObjectID;
    userId: string;
    billingAddressId: string;
    shippingAddressId: string;
    products: [];
    orderStatus: string;
    paymentGatewayDetails?: any;
    purchaseOrderPath?: string;
    tracking: Tracking;
    trackingId: string;
    invoiceFiles?: [];
}

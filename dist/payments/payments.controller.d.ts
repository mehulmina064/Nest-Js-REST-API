import { PaymentService } from './payments.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPaymentTerms(): Promise<any>;
    getPaymentGateway(): Promise<any>;
    getPaymentGatewayById(id: string): Promise<any>;
    getPaymentTermsById(id: string): Promise<any>;
    savePaymentTerms(paymentTerms: any): Promise<any>;
    savePaymentGateway(paymentGateway: any): Promise<import("./paymentGateway.entity").PaymentGateway>;
    updatePaymentTerms(id: string, paymentTerms: any): Promise<any>;
    updatePaymentGateway(id: string, paymentGateway: any): Promise<import("./paymentGateway.entity").PaymentGateway>;
    deletePaymentTerms(id: string): Promise<any>;
    deletePaymentGateway(id: string): Promise<import("./paymentGateway.entity").PaymentGateway>;
}

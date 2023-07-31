import { PaymentTerms } from './payment-terms.entity';
import { Payments } from './payments.entity';
import { Repository } from 'typeorm';
import { PaymentGatewayAccount, PaymentGateway } from './paymentGateway.entity';
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly paymentGatewayAccountRepository;
    private readonly paymentGatewayRepository;
    private readonly paymentTermsRepository;
    constructor(paymentRepository: Repository<Payments>, paymentGatewayAccountRepository: Repository<PaymentGatewayAccount>, paymentGatewayRepository: Repository<PaymentGateway>, paymentTermsRepository: Repository<PaymentTerms>);
    findAll(filter: {}): Promise<PaymentTerms[]>;
    findOne(id: string): Promise<PaymentTerms>;
    save(payment: PaymentTerms): Promise<PaymentTerms>;
    delete(id: string): Promise<PaymentTerms>;
    update(id: string, payment: PaymentTerms): Promise<PaymentTerms>;
    getPaymentGateways(id: string): Promise<PaymentGateway[]>;
    savePaymentGateway(paymentGateway: PaymentGateway): Promise<PaymentGateway>;
    deletePaymentGateway(id: string): Promise<PaymentGateway>;
    updatePaymentGateway(id: string, paymentGateway: PaymentGateway): Promise<PaymentGateway>;
}

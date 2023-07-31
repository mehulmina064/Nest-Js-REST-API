import { PaymentTerms } from './payment-terms.entity';
// Create Service for ./payment.entity.ts
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from './payments.entity';
import { ObjectID, Repository } from 'typeorm';
import { PaymentGatewayAccount, PaymentGateway } from './paymentGateway.entity';

@Controller('payment')
export class PaymentService {
    constructor(
        @InjectRepository(Payments)
        private readonly paymentRepository: Repository<Payments>,
        @InjectRepository(PaymentGatewayAccount)
        private readonly paymentGatewayAccountRepository: Repository<PaymentGatewayAccount>,
        @InjectRepository(PaymentGateway)
        private readonly paymentGatewayRepository: Repository<PaymentGateway>,
        @InjectRepository(PaymentTerms)
        private readonly paymentTermsRepository: Repository<PaymentTerms>
    ) { }

    async findAll(filter: {}): Promise<PaymentTerms[]> {
        if (filter) {
            return await this.paymentTermsRepository.find(filter);
        }
        return await this.paymentTermsRepository.find();
    }

    async findOne(id: string): Promise<PaymentTerms> {
        return await this.paymentTermsRepository.findOne(id);
    }
    
    async save(payment: PaymentTerms): Promise<PaymentTerms> {
        return await this.paymentTermsRepository.save(payment);
    }

    async delete(id: string): Promise<PaymentTerms> {
        return await this.paymentTermsRepository.delete(id);
    }

    async update(id: string, payment: PaymentTerms): Promise<PaymentTerms> {
        return await this.paymentTermsRepository.update(id, payment);
    }

    async getPaymentGateways(id: string): Promise<PaymentGateway[]> {
        return await this.paymentGatewayRepository.find() 
    }

    async savePaymentGateway(paymentGateway: PaymentGateway): Promise<PaymentGateway> {
        return await this.paymentGatewayRepository.save(paymentGateway);
    }

    async deletePaymentGateway(id: string): Promise<PaymentGateway> {
        return await this.paymentGatewayRepository.delete(id);
    }

    async updatePaymentGateway(id: string, paymentGateway: PaymentGateway): Promise<PaymentGateway> {
        return await this.paymentGatewayRepository.update(id, paymentGateway);
    }

}
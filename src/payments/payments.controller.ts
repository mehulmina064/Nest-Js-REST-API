import { Controller, Get, Delete, Patch, Post } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Controller('payments/')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) { }
  @Get('payment-terms')
  async getPaymentTerms() {
    return await this.paymentService.getPaymentTerms();
  }

  @Get('payment-gateway')
  async getPaymentGateway() {
    return await this.paymentService.getPaymentGateway();
  }

  @Get('payment-gateway/:id')
  async getPaymentGatewayById(@Param('id') id: string) {
    return await this.paymentService.getPaymentGatewayById(id);
  }

  @Get('payment-terms/:id')
  async getPaymentTermsById(@Param('id') id: string) {
    return await this.paymentService.getPaymentTermsById(id);
  }

  @Post('payment-terms')
  async savePaymentTerms(@Body() paymentTerms: any) {
    return await this.paymentService.savePaymentTerms(paymentTerms);
  }

  @Post('payment-gateway')
  async savePaymentGateway(@Body() paymentGateway: any) {
    return await this.paymentService.savePaymentGateway(paymentGateway);
  }

  @Patch('payment-terms/:id')
  async updatePaymentTerms(@Param('id') id: string, @Body() paymentTerms: any) {
    return await this.paymentService.updatePaymentTerms(id, paymentTerms);
  }

  @Patch('payment-gateway/:id')
  async updatePaymentGateway(@Param('id') id: string, @Body() paymentGateway: any) {
    return await this.paymentService.updatePaymentGateway(id, paymentGateway);
  }

  @Delete('payment-terms/:id')
  async deletePaymentTerms(@Param('id') id: string) {
    return await this.paymentService.deletePaymentTerms(id);
  }

  @Delete('payment-gateway/:id')
  async deletePaymentGateway(@Param('id') id: string) {
    return await this.paymentService.deletePaymentGateway(id);
  }
}



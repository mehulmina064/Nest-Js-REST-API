import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  providers: [FaqService],
  controllers: [FaqController],
})
export class FaqModule {}

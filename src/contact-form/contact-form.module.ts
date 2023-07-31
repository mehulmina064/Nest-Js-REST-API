import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactForm } from './contact-form.entity';
import { ContactFormService } from './contact-form.service';
import { ContactFormController } from './contact-form.controller';
import { MailModule } from '../mail/mail.module';
import { FilesModule } from '../files/files.module';
import { MailTriggerModule } from '../mailTrigger/mailTrigger.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactForm]), MailModule, FilesModule, MailTriggerModule],
  providers: [ContactFormService],
  controllers: [ContactFormController],
})
export class ContactFormModule {}

import { AttachmentPublicController } from './attachment-public.controller';
import { Attachment } from "./attachment.entity";
import { AttachmentService } from "./attachment.service";
import { AttachmentController } from "./attachment.controller";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";
import { AuthenticationModule } from "../authentication/authentication.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Attachment]),
        MailModule,
        AuthenticationModule,
    ],
    controllers: [AttachmentController,AttachmentPublicController],
    providers: [AttachmentService],
    exports: [AttachmentService, TypeOrmModule.forFeature([Attachment])],
})
export class AttachmentModule {}

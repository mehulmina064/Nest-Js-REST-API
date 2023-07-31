// GST Module   
import { Module } from '@nestjs/common';
import { GstService } from './gst.service';
import { GstController } from './gst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gst } from './gst.entity';
import { MailModule } from '../mail/mail.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthGuard } from '../authentication/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from '../files/file.utils';
import { HSNCode } from './hsn.entity';
import { SACCode } from './sac.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([Gst, HSNCode, SACCode]),
        MailModule,
        AuthenticationModule,
    ],
    controllers: [GstController],
    providers: [GstService],
    exports: [GstService, TypeOrmModule.forFeature([Gst, HSNCode, SACCode])],
})
export class GstModule { }

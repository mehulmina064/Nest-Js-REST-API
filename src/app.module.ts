import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './users/user.module';
import { OrganizationModule } from './organization/organization.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  

    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_DB_OLD,
      // url: process.env.MONGO_DB_TEST,
      database: process.env.MONGO_DB_NAME_MAIN,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: false,
      useNewUrlParser: true,
      ssl: true, 
       
    }),
    MailModule,
    UserModule,
    OrganizationModule,
    UserModule,
    AuthenticationModule,
  ]
})  

export class AppModule { }

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { config } from 'aws-sdk';
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('E-COMMERCE')
    .addBearerAuth()
    .setDescription('API')
    .setVersion('1.0')
    .build();
  // const document = SwaggerModule.createDocument(app, options);
  // const configService = app.get(ConfigService);
  // config.update({
  //   accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
  //   secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  //   region: configService.get('AWS_REGION'),
  // });
  // SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

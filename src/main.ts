import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
  await app.listen(process.env.PORT || 3000);
}
bootstrap();

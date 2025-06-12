import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            origin: 'http://localhost:3001',
            methods: '*',
        },
    });
  const options = new DocumentBuilder()
      .setTitle('API docs')
      .setVersion('1.0')
      .addBearerAuth(
          {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              name: 'Authorization',
              description: 'Введіть токен у форматі: Bearer <token>',
              in: 'header',
          },
          'access-token',
      )
      .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe(
      {
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      },
  ))
  const port = new ConfigService().get('API_PORT') || 3000;

  await app.listen(port)

  Logger.log(
      `🚀 Application is running on: http://localhost:${ port }`,
  )
}
bootstrap();

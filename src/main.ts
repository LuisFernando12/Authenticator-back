import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/auth');
  const config = new DocumentBuilder()
    .setTitle('Authenticator API')
    .setDescription('API documentation for the Authenticator service')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory());
  await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://127.0.0.1:4173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.listen(process.env.PORT ?? 3000);
    const url = await app.getUrl();
    console.log(`🚀 Server running at: ${url}`);
    console.log(`🚀 GraphQL endpoint: ${url}/graphql`);
    console.log(`💡 Use Apollo Studio or Postman to query: POST ${url}/graphql`);
  } catch (error) {
    console.error('Error starting server:', error);
  }
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://test-ims-muhamadrafliseptians-projects.vercel.app', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  await app.listen(process.env.PORT ?? 3008);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan CORS dan tentukan origin yang diizinkan
  app.enableCors({
    origin: 'http://localhost:3001',  // Gantilah dengan alamat origin frontend Anda
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  // Menentukan port aplikasi
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

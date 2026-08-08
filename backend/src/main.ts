import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';


const configService = new ConfigService();
const APP_PORT = configService.get<number>('APP_PORT') || 8000;
const FRONTEND_URL = configService.get<number>('FRONTEND_URL') || 'http://localhost:3000';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors(FRONTEND_URL)
  await app.listen(APP_PORT,
    () => {
      console.log(`Server is running on port:⚡${APP_PORT}⚡`);
    }
  );
}
bootstrap();

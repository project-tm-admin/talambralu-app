import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const redisIoAdapter = new RedisIoAdapter(app);
  try {
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);
  } catch (error) {
    console.error(
      'Failed to connect to Redis, WebSockets might not work correctly across instances:',
      error.message,
    );
    // Optionally fallback to default adapter or terminate if Redis is strictly required
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { ResellBatchModule } from './resell-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(ResellBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();

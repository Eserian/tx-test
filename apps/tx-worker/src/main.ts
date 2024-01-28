import { NestFactory } from '@nestjs/core';
import { TxWorkerAppModule } from './tx-worker.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(TxWorkerAppModule);
}
bootstrap();

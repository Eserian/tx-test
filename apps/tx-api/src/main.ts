import { NestFactory } from '@nestjs/core';
import { TxApiServiceModule } from './tx-api.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TxApiServiceModule);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  await app.listen(port);
}
bootstrap();

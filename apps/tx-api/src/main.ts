import { NestFactory } from '@nestjs/core';
import { TxApiAppModule } from './tx-api.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TxApiAppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');

  await app.listen(port);
}
bootstrap();

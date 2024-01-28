import { NestFactory } from '@nestjs/core';
import { TxApiAppModule } from './tx-api.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TxApiAppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('app.port');
  const host = configService.get('app.host');

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Transaction API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/v1/docs', app, document);

  await app.listen(port).then(() => {
    Logger.log(`http://${host}:${port} - server start`);
    Logger.log(`http://${host}:${port}/v1/docs - swagger start`);
  });
}
bootstrap();

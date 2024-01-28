import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { config } from './config';
import { Tx } from 'shared/entities';
import { TxService } from './tx-api.service';
import { TxController } from './tx-api.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    TypeOrmModule.forFeature([Tx]),
  ],
  providers: [TxService],
  controllers: [TxController],
})
export class TxApiServiceModule {}

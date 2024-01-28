import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tx } from 'shared/entities';
import { ScheduleModule } from '@nestjs/schedule';
import { dataSourceOptions } from 'db/data-source';
import { TxService } from './tx-worker.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceOptions, autoLoadEntities: true }),
    TypeOrmModule.forFeature([Tx]),
    ScheduleModule.forRoot(),
  ],
  providers: [TxService],
})
export class TxWorkerAppModule {}

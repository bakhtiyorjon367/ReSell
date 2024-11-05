import { Module } from '@nestjs/common';
import { ResellBatchController } from './resell-batch.controller';
import { ResellBatchService } from './resell-batch.service';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, ScheduleModule.forRoot()],
  controllers: [ResellBatchController],
  providers: [ResellBatchService],
})
export class ResellBatchModule {}

import { Module } from '@nestjs/common';
import { ResellBatchController } from './resell-batch.controller';
import { ResellBatchService } from './resell-batch.service';
import {ConfigModule} from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ResellBatchController],
  providers: [ResellBatchService],
})
export class ResellBatchModule {}

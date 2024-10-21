import { Module } from '@nestjs/common';
import { ResellBatchController } from './resell-batch.controller';
import { ResellBatchService } from './resell-batch.service';

@Module({
  imports: [],
  controllers: [ResellBatchController],
  providers: [ResellBatchService],
})
export class ResellBatchModule {}

import { Controller, Get } from '@nestjs/common';
import { ResellBatchService } from './resell-batch.service';

@Controller()
export class ResellBatchController {
  constructor(private readonly resellBatchService: ResellBatchService) {}

  @Get()
  getHello(): string {
    return this.resellBatchService.getHello();
  }
}

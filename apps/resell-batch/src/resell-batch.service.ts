import { Injectable } from '@nestjs/common';

@Injectable()
export class ResellBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}

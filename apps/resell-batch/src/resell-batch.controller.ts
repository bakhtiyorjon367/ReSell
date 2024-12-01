import { Controller, Get, Logger } from '@nestjs/common';
import { ResellBatchService } from './resell-batch.service';
import { Cron,  Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_ACTIVE_USERS, BATCH_TOP_PRODUCTS } from './lib/config';

@Controller()
export class ResellBatchController {
  constructor(private readonly batchService: ResellBatchService) {}
  private logger:Logger = new Logger('SocketEventsGateway');

  @Timeout(1000)
  hadnleTimeout(){
    this.logger.debug("Batch Server Ready");
  }

  @Cron("00 00 01 * * *", {name:BATCH_ROLLBACK})
  public async batchRollback(){
    try{
      this.logger["context"] = BATCH_ROLLBACK;
      this.logger.debug("EXECUTED");
  
      await this.batchService.batchRollback();
    }catch(err){
      this.logger.error(err);

    }
  }

  @Cron("20 00 01 * * *", {name:BATCH_TOP_PRODUCTS})
  public async batchTopProduts(){
    try{
      this.logger["context"] = BATCH_TOP_PRODUCTS;
      this.logger.debug("EXECUTED");
  
      await this.batchService.batchTopProducts();
    }catch(err){
      this.logger.error(err);
    }
  }

  @Cron("40 00 01 * * *", {name:BATCH_ACTIVE_USERS})
  public async batchActiveUsers(){
    try{
      this.logger["context"] = BATCH_ACTIVE_USERS;
      this.logger.debug("EXECUTED");
  
      await this.batchService.batchActiveUsers();
    }catch(err){
      this.logger.error(err);
    }
  }
  
  @Get()
  getHello(): string {
    return this.batchService.getHello();
  }
  
}


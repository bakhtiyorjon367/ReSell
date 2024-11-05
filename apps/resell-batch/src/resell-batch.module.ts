import { Module } from '@nestjs/common';
import { ResellBatchController } from './resell-batch.controller';
import { ResellBatchService } from './resell-batch.service';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from 'apps/resell-api/src/schemas/Member.model';
import ProductSchema from 'apps/resell-api/src/schemas/Product.model';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    DatabaseModule, 
    ScheduleModule.forRoot(), 
    MongooseModule.forFeature([{name:'Member', schema:MemberSchema}]),
    MongooseModule.forFeature([{name:'Product', schema:ProductSchema}]),
  ],
  controllers: [ResellBatchController],
  providers: [ResellBatchService],

})
export class ResellBatchModule {}

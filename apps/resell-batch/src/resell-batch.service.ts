import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/resell-api/src/libs/dto/member/member';
import { Product } from 'apps/resell-api/src/libs/dto/product/product';
import { MemberStatus, MemberType } from 'apps/resell-api/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/resell-api/src/libs/enums/product.enum';
import { Model } from 'mongoose';

@Injectable()
export class ResellBatchService {
  constructor(
  @InjectModel('Member') private readonly memberModel:Model<Member>,
  @InjectModel('Product') private readonly productModel:Model<Product>,
  ){}

  public async batchRollback():Promise<void>{
    console.log('batchRollback');

    await this.productModel.updateMany(
      {productStatus: ProductStatus.ACTIVE},
      {productRank:0}
    ).exec();

    await this.memberModel.updateMany(
      {memberStatus:MemberStatus.ACTIVE, memberType: MemberType.USER  },
      {memberRank:0}
    ).exec();
  }
  

  public async batchTopProducts():Promise<void>{
    console.log('batchProduct');

    const products:Product[] =  await this.productModel.find(
      {productStatus: ProductStatus.ACTIVE},
      {productRank:0}
    ).exec();

    const promisedList = products.map(async(ele:Product)=>{
      const {_id, productLikes, productViews} = ele;
      const rank = productLikes * 2 + productViews*1;
      return await this.productModel.findByIdAndUpdate(_id,{productRank:rank});
    });

    await Promise.all(promisedList);

  }
  

  public async batchActiveUsers():Promise<void>{
    console.log('batchUsers');

    const  users:Member[] =  await this.memberModel.find(
      {
       memberType: MemberType.USER,
       memberStatus:MemberStatus.ACTIVE, 
       memberRank:0,
      }
    ).exec();

    const promisedList = users.map(async(ele:Member)=>{
      const {_id, memberProduct, memberLikes, memberArticles, memberViews, memberComments, memberPurchase} = ele;
      const rank = memberProduct * 5 + memberPurchase * 4 + memberArticles * 3 + memberLikes * 2 + memberViews * 1 + memberComments * 1;
      return await this.memberModel.findByIdAndUpdate(_id,{memberRank:rank});
    });

    await Promise.all(promisedList);
  }
  

  getHello(): string {
    return 'Hello Nestar BATCH server!';
  }
}


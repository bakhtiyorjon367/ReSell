import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Product } from '../../libs/dto/product/product';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class ProductService {
    constructor(@InjectModel ('Product') private readonly productModel: Model<Product>,
       private memberService: MemberService,
    ){}

    public async createProduct(input:ProductInput):Promise<Product> {
        try{
            const result = await this.productModel.create(input);  
            await this.memberService.memberStatsEditior({_id:result.memberId, targetKey:'memberProduct', modifier:1}); //increase memberProperty
            return result;
        }catch(err){
            console.log("Error: PropertyService.model",err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
        
    }
}

import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ProductInput } from '../../libs/dto/product/product.input';
import { Product } from '../../libs/dto/product/product';
import { Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';

@Injectable()
export class ProductService {
    constructor(@InjectModel ('Product') private readonly productModel: Model<Product>,
       private memberService: MemberService,
       private viewService: ViewService,
    ){}

    public async createProduct(input:ProductInput):Promise<Product> {
        try{
            const result = await this.productModel.create(input);  
            await this.memberService.memberStatsEditior({_id:result.memberId, targetKey:'memberProduct', modifier:1}); //increase memberProperty
            return result;
        }catch(err){
            console.log("Error: productService.model",err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }

    public async getProduct(memberId:ObjectId, productId: ObjectId):Promise<Product> {
        const search: T = {
            _id: productId,
            productStatus: [
                ProductStatus.ACTIVE,
                ProductStatus.RESERVED,
                ProductStatus.SOLD
            ],
        };
        const targetProduct: Product = await this.productModel.findOne(search).exec();
        if(!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        if(memberId){
            const viewInput = { memberId: memberId, viewRefId: productId, viewGroup: ViewGroup.PRODUCT };
            const newView = await this.viewService.recordView(viewInput);
            if(newView) {
                await this.productStatsEditor({_id: productId, targetKey: 'productViews', modifier:1});
                targetProduct.productViews++;
            }

            //meLiked
        }

        targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
        return targetProduct;
    }
    public async productStatsEditor (input: StatisticModifier):Promise<Product>{
        const { _id, targetKey, modifier} = input;
        return await this.productModel.findByIdAndUpdate(
            _id, 
            {$inc: {[targetKey]:modifier}}, 
            {new: true})
            .exec();

    }
}

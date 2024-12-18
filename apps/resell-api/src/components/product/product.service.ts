import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { AllProductsInquiry, OrdinaryInquiry, ProductInput, ProductsInquiry, UserProductsInquiry } from '../../libs/dto/product/product.input';
import { Product, Products } from '../../libs/dto/product/product';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductStatus } from '../../libs/enums/product.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { ProductUpdate } from '../../libs/dto/product/product.update';
import * as moment from 'moment';
import { lookUpAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeService } from '../like/like.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class ProductService {
    constructor(@InjectModel ('Product') private readonly productModel: Model<Product>,
       private memberService: MemberService,
       private viewService: ViewService,
       private likeService: LikeService,
       private notificationService:NotificationService,
    ){}

    public async createProduct(input:ProductInput):Promise<Product> {
        try{
            const result = await this.productModel.create(input);  
            await this.memberService.memberStatsEditior({_id:result.memberId, targetKey:'memberProduct', modifier:1}); //increase memberProduct
            return result;
        }catch(err){
            console.log("Error: productService.model",err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }/*_____________________________________________________________________________________________________________________*/

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
            const likeInput = {memberId: memberId, likeRefId: productId, likeGroup: LikeGroup.PRODUCT};
            targetProduct.meLiked = await this.likeService.cheekLikeExistence(likeInput);

        }

        targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
        return targetProduct;
    }/*_____________________________________________________________________________________________________________________*/

 
    public async updateProduct(memberId:ObjectId, input:ProductUpdate):Promise<Product> {
        let { productStatus, soldAt, deletedAt} = input;
        const search: T = {
            _id: input._id,
            memberId: memberId,
            productStatus: [
                ProductStatus.ACTIVE,
                ProductStatus.RESERVED,
                ProductStatus.SOLD,
            ],
        };

        if(productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
        else if(productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.productModel.findOneAndUpdate(search, input, { new: true}).exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if(deletedAt){
                await this.memberService.memberStatsEditior({_id: memberId, targetKey: 'memberProduct', modifier:-1});
        }
        
        return result;
    }/*_____________________________________________________________________________________________________________________*/


    public async getProducts(memberId:ObjectId, input:ProductsInquiry):Promise<Products> {
        const match:T = {productStatus: { $ne: ProductStatus.DELETE }}
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };

        this.shapeMatchQuery (match, input);

        const result = await this.productModel.
        aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet: {
                    list: [
                        {$skip: (input.page - 1)* input.limit},
                        {$limit: input.limit},
                        lookUpAuthMemberLiked(memberId),//meLiked
                        lookupMember,
                        {$unwind: '$memberData'}
                    ],
                    metaCounter: [{$count: 'total'}],
                },
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }
    private shapeMatchQuery(match:T, input:ProductsInquiry):void {
        const {
            memberId,
            locationList,
            typeList,
            pricesRange,
            options,
            text,
            productSharing,
        } = input.search;
        if(memberId) match.memberId = shapeIntoMongoObjectId(memberId);
        if(locationList && locationList.length) match.productLocation = {$in: locationList};
        if(typeList  && typeList.length) match.productCategory = {$in: typeList};
        if(pricesRange) match.productPrice = {$gte: pricesRange.start, $lte: pricesRange.end};
        if(text) match.productTitle = {$regex: new RegExp(text, 'i')};
        if (productSharing === true) {
            match.productSharing = true;
        } else if (productSharing === false) {
            match.productSharing = false;
        }
        if(options && options.length > 0) {
            match['$or'] = options.map((ele) => {
                return { [ele]: true};
            });
        }
    }/*_____________________________________________________________________________________________________________________*/

    public async getFavorites(memberId:ObjectId, input:OrdinaryInquiry):Promise<Products>{
        return await this.likeService.getFavoriteProducts(memberId,input);
    }
    
    public async getVisited(memberId:ObjectId, input:OrdinaryInquiry):Promise<Products>{
        return await this.viewService.getVisitedProducts(memberId,input);
    }/*_____________________________________________________________________________________________________________________*/

    public async getUserProducts(memberId:ObjectId, input:UserProductsInquiry):Promise<Products> {
        const {productStatus} =input.search;
        if(productStatus === ProductStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

        const match: T = {
            memberId: memberId,
            productStatus: productStatus ?? {$ne: ProductStatus.DELETE},
        };
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };
        const result = await this.productModel.
        aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet: {
                    list: [
                        {$skip: (input.page - 1)* input.limit},
                        {$limit: input.limit},
                        lookUpAuthMemberLiked(memberId),//meLiked
                        lookupMember,
                        {$unwind: '$memberData'}
                    ],
                    metaCounter: [{$count: 'total'}],
                },
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }/*_____________________________________________________________________________________________________________________*/

    public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId):Promise<Product>{
        const target:Product = await this.productModel.findOne({_id:likeRefId});
        if(!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input:LikeInput ={
            memberId:memberId,
            likeRefId:likeRefId,
            likeGroup:LikeGroup.PRODUCT
        };
        let modifier:number = await this.likeService.toggleLike(input);
        const result = this.productStatsEditor({_id:likeRefId, targetKey:'productLikes', modifier:modifier});
        if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        
        const product = await this.getProduct(null,likeRefId);
        const liker = await this.memberService.getMember(null, memberId);
        const receiverId =  await this.getMemberId(input.likeRefId)
        if(memberId.toString() !== receiverId.toString()){
            const notification:NotificationInput= {
                notificationType: NotificationType.LIKE,
                notificationGroup: NotificationGroup.PRODUCT,
                notificationTitle:  `${liker.memberNick} has liked your product '${product.productTitle}'`,
                authorId: memberId,
                receiverId: receiverId,
                productId: likeRefId,
                articleId: null
            };
            if(modifier === 1){
                await this.notificationService.createNotification(notification);
            }else{
                const input = {
                    authorId:memberId, 
                    receiverId:receiverId, 
                    productId:likeRefId}
                await this.notificationService.deleteNotification(input);
            }
        }
       
        return result;
    }
    public async getMemberId (productId:ObjectId):Promise<ObjectId>{
        const result = await this.productModel.findOne({_id:productId});

        if(!result) throw new InternalServerErrorException(Message.BLOCKED_USER);
        return result.memberId;
    }/*_____________________________________________________________________________________________________________________*/


    public async getAllProductsByAdmin(input:AllProductsInquiry):Promise<Products> {
        const {productStatus, productLocationList} =input.search;
        const match:T = {};
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };

        if(productStatus) match.productStatus = productStatus;
        if(productLocationList) match.productLocation = {$in: productLocationList};

        const result = await this.productModel.
        aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet: {
                    list: [
                        {$skip: (input.page - 1)* input.limit},
                        {$limit: input.limit},
                        lookupMember,
                        {$unwind: '$memberData'}
                    ],
                    metaCounter: [{$count: 'total'}],
                },
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }/*_____________________________________________________________________________________________________________________*/

    public async updateProductByAdmin(input:ProductUpdate):Promise<Product> {
        let { productStatus, soldAt, deletedAt} = input;
        const search: T = {
            _id: input._id,
            productStatus: ProductStatus.ACTIVE,
        };

        if(productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
        else if(productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

        const result = await this.productModel.findOneAndUpdate(search, input, { new: true}).exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        if(soldAt || deletedAt){
                await this.memberService.memberStatsEditior({_id: result.memberId, targetKey: 'memberProducts', modifier:-1});
        }
        
        return result;
    }/*_____________________________________________________________________________________________________________________*/

    public async removeProductByAdmin(productId:ObjectId):Promise<Product> {
        const search : T = {_id: productId, productStatus: ProductStatus.DELETE};
        const result = await this.productModel.findOneAndDelete(search).exec();
        if(!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }/*_____________________________________________________________________________________________________________________*/

    public async productStatsEditor (input: StatisticModifier):Promise<Product>{
        const { _id, targetKey, modifier} = input;
        return await this.productModel.findByIdAndUpdate(
            _id, 
            {$inc: {[targetKey]:modifier}}, 
            {new: true}
        ).exec();

    }
}

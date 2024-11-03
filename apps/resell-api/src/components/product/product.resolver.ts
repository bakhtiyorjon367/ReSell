import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Product, Products } from '../../libs/dto/product/product';
import { ProductInput, ProductsInquiry } from '../../libs/dto/product/product.input';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProductUpdate } from '../../libs/dto/product/product.update';

@Resolver()
export class ProductResolver {
    constructor(private readonly productService: ProductService) {}

    @Roles(MemberType.USER)
    @UseGuards(RolesGuard)
    @Mutation(() => Product)
    public async createProduct(
        @Args('input') input:ProductInput, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Product>{
        console.log("Mutation: createPProduct");
        input.memberId = memberId;

        return await this.productService.createProduct(input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Product)
    public async getProduct(
        @Args('productId') input:string, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Product>{
        console.log("Query: getProduct");
       const  productId = shapeIntoMongoObjectId(input);

        return await this.productService.getProduct(memberId, productId);
    }

    @Roles(MemberType.USER)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Product)
    public async updateProduct(
        @Args('input') input:ProductUpdate, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Product>{
        console.log("Mutation: updateProduct");
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.productService.updateProduct(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Products)
    public async getProducts(
        @Args('input') input:ProductsInquiry, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Products>{
        console.log("Query: getProducts");
        return await this.productService.getProducts(memberId, input);
    }
}

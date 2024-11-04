import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Product, Products } from '../../libs/dto/product/product';
import { AllProductsInquiry, ProductInput, ProductsInquiry, UserProductsInquiry } from '../../libs/dto/product/product.input';
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
        console.log("Mutation: createProduct");
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

    @Roles(MemberType.USER)
    @UseGuards(RolesGuard)
    @Query((returns) => Products)
    public async getUserProducts(
        @Args('input') input:UserProductsInquiry, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Products>{
        console.log("Query: getUserProducts");
        return await this.productService.getUserProducts(memberId, input);
    }

 /*ADMIN */

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Query((returns) => Products)
    public async getAllProductsByAdmin(
        @Args('input') input:AllProductsInquiry, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Products>{
        console.log("Query: getAllProductsByAdmin");
        return await this.productService.getAllProductsByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Product)
    public async updateProductByAdmin(@Args('input') input:ProductUpdate):Promise<Product>{
        console.log("Mutation: updateProductByAdmin");
        return await this.productService.updateProductByAdmin(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Product)
    public async removeProductByAdmin(@Args('productId') input:string):Promise<Product>{
        console.log("Mutation: removeProductByAdmin");
        const productId = shapeIntoMongoObjectId(input);
        return await this.productService.removeProductByAdmin(productId);
    }
}

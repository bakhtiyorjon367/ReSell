import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Product } from '../../libs/dto/product/product';
import { ProductInput } from '../../libs/dto/product/product.input';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';

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
}

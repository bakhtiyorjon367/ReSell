import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { ProductLocation, ProductStatus, ProductCategory } from "../../enums/product.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";


@ObjectType()
export class Product {
    @Field(() => String)
    _id: ObjectId;

    @Field(()=> ProductCategory)
    productCategory: ProductCategory;

    @Field(()=> ProductStatus)
    productStatus: ProductStatus;

    @Field(()=> ProductLocation)
    productLocation: ProductLocation;

    @Field(() => String)
    dealAddress: string;

    @Field(() => String)
    productTitle: string;

    @Field(() => Number)
    productPrice: number;

    @Field(() => Int)
    productViews: number;

    @Field(() => Int)
    productLikes: number;

    @Field(() => [String])
    productImages: string[];

    @Field(() => String, {nullable:true})
    productDesc?: string;

    @Field(() => Boolean)
    productBarter: boolean;

    @Field(() => Boolean)
    productSharing: boolean;

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date, {nullable:true})
    soldAt?:Date;

    @Field(() => Date, {nullable:true})
    deletedAt?:Date;

    @Field(() => Date, {nullable:true})
    manufacturedAt?:Date;

    @Field(() => Date)
    createdAt:Date;

    @Field(() => Date)
    updatedAt:Date;

   // from Aggregation
    @Field(() => Member, {nullable: true})
    memberData?: Member;

    @Field(() => [MeLiked], {nullable:true})
    meLiked?: MeLiked[];

}

@ObjectType()
export class Products {
    @Field(() => [Product])
    list: Product[];

    @Field(()=> [TotalCounter], {nullable: true})
    metaCounter: TotalCounter[];
}


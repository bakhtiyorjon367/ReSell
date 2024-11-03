import { Field, InputType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { ProductLocation, ProductStatus, ProductCategory } from "../../enums/product.enum";
import { IsNotEmpty, IsOptional, Length } from "class-validator";


@InputType()
export class ProductUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(()=> ProductCategory, {nullable: true})
    productCategory?: ProductCategory;

    @IsOptional()
    @Field(()=> ProductStatus, {nullable: true})
    productStatus?: ProductStatus;

    @IsOptional()
    @Field(()=> ProductLocation, {nullable: true})
    productLocation?: ProductLocation;

    @IsOptional()
    @Length(3,100)
    @Field(() => String, {nullable: true})
    dealAddress?: string;

    @IsOptional()
    @Length(3,100)
    @Field(() => String, {nullable: true})
    productTitle?: string;

    @IsOptional()
    @Field(() => Number, {nullable: true})
    productPrice?: number;

    @IsOptional()
    @Field(() => [String], {nullable: true})
    productImages?: string[];

    @IsOptional()
    @Length(5,500)
    @Field(() => String, {nullable:true})
    productDesc?: string;

    @IsOptional()
    @Field(() => Boolean, {nullable: true})
    productBarter?: boolean;

    @IsOptional()
    @Field(() => Boolean, {nullable: true})
    productSharing?: boolean;

    @IsOptional()
    @Field(() => String, {nullable: true})
    memberId?: ObjectId;

    soldAt?:Date;

    deletedAt?:Date;

    @IsOptional()
    @Field(() => Date, {nullable:true})
    manufacturedAt?:Date;

}
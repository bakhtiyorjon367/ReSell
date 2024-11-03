import { Field, InputType } from "@nestjs/graphql";
import {  IsNotEmpty, IsOptional, Length } from "class-validator";
import { ProductCategory, ProductLocation } from "../../enums/product.enum";
import { ObjectId } from "mongoose";


@InputType()
export class ProductInput {

   @IsNotEmpty()
   @Field(() => ProductCategory)
   productCategory:ProductCategory

   @IsNotEmpty()
   @Field(() => String)
   productLocation:ProductLocation;

   @IsNotEmpty()
   @Length(3,100)
   @Field(() => String)
   dealAddress:string

   @IsNotEmpty()
   @Length(3,100)
   @Field(() => String)
   productTitle:string

   @IsNotEmpty()
   @Field(() => Number)
   productPrice:number

   @IsNotEmpty()
   @Field(() =>[String])
   productImages: string[];

   @IsOptional()
   @Length(5,500)
   @Field(() => String, {nullable:true})
   productDesc?:string

   @IsOptional()
   @Field(() => Boolean, {nullable:true})
   productBarter?:boolean

   @IsOptional()
   @Field(() => Boolean, {nullable:true})
   productSharing?:boolean

   memberId: ObjectId;

   @IsOptional()
   @Field(() => Date, {nullable:true})
   manufacturedAt?:Date
}
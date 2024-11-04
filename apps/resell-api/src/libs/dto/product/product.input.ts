import { Field, InputType, Int } from "@nestjs/graphql";
import {  IsIn, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { ProductCategory, ProductLocation, ProductStatus } from "../../enums/product.enum";
import { ObjectId } from "mongoose";
import { availableOptions, availableProductSorts } from "../../config";
import { Direction } from "../../enums/common.enum";


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
}//____________________________________________________________________________________________________


@InputType()
export class PricesRange{
   @Field(() => Int)
   start: number;

   @Field(() => Int)
   end: number;
}

@InputType()
class PISearch{
   @IsOptional()
   @Field(() => String, {nullable: true})
   memberId?: ObjectId;

   @IsOptional()
   @Field(() => [ProductLocation], {nullable: true})
   locationList?: ProductLocation[];

   @IsOptional()
   @Field(() => [ProductCategory], {nullable: true})
   typeList?: ProductCategory[];

   @IsOptional()
   @IsIn(availableOptions, {each: true})
   @Field(() => [String], {nullable :true})
   options?: string[];

   @IsOptional()
   @Field(() => PricesRange, {nullable: true})
   pricesRange?:PricesRange;

   @IsOptional()
   @Field(() => String, {nullable: true})
   text?: string;
}

@InputType()
export class ProductsInquiry {
   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   page:number;

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   limit:number;

   @IsOptional()
   @IsIn(availableProductSorts)
   @Field(() => String, {nullable: true})
   sort?:string;

   @IsOptional()
   @Field(() => Direction, {nullable: true})
   direction?:Direction;

   @IsNotEmpty()
   @Field(() => PISearch)
   search:PISearch;

}

@InputType()
class APISearch{
   @IsOptional()
   @Field(() => ProductStatus, {nullable: true})
   productStatus?: ProductStatus;
}

@InputType()
export class UserProductsInquiry{
   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   page:number;

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   limit:number;

   @IsOptional()
   @IsIn(availableProductSorts)
   @Field(() => String, {nullable: true})
   sort?:string;

   @IsOptional()
   @Field(() => Direction, {nullable: true})
   direction?:Direction;

   @IsNotEmpty()
   @Field(() => APISearch)
   search: APISearch;
}

@InputType()
class ALPISearch{
   @IsOptional()
   @Field(() => ProductStatus, {nullable: true})
   productStatus?: ProductStatus;
   
   @IsOptional()
   @Field(() => [ProductLocation], {nullable: true})
   productLocationList?: ProductLocation[];
}

@InputType()
export class AllProductsInquiry{
   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   page:number;

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   limit:number;

   @IsOptional()
   @IsIn(availableProductSorts)
   @Field(() => String, {nullable: true})
   sort?:string;

   @IsOptional()
   @Field(() => Direction, {nullable: true})
   direction?:Direction;

   @IsNotEmpty()
   @Field(() => ALPISearch)
   search: ALPISearch;
}

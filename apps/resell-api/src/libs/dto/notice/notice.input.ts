import { Field, InputType, Int } from "@nestjs/graphql";
import { NoticeCategory, NoticeStatus } from "../../enums/notice.enum";
import { ObjectId } from "mongoose";
import { IsNotEmpty, IsOptional, Min } from "class-validator";
import { Direction } from "../../enums/common.enum";


@InputType()
export class NoticeInput {

    @IsNotEmpty()
    @Field(() => NoticeCategory)
    noticeCategory: NoticeCategory;

    @IsNotEmpty()
    @Field(() => String)
    noticeTitle:String;

    @IsNotEmpty()
    @Field(() => String)
    noticeContent:String;

    memberId: ObjectId;
}


@InputType()
class NSearch {
    @IsOptional()
    @Field(() => NoticeStatus, {nullable: true})
    noticeStatus?: NoticeStatus;

    @IsOptional()
    @Field(() => NoticeCategory, {nullable: true})
    noticeCategory?: NoticeCategory;
}

@InputType()
export class NoticesInquiry {
   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   page:number;

   @IsNotEmpty()
   @Min(1)
   @Field(() => Int)
   limit:number;

   @IsOptional()
   @Field(() => String, {nullable: true})
   sort?:string;

   @IsNotEmpty()
   @Field(()=> NSearch)
   search: NSearch;
}

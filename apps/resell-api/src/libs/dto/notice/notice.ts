import { Field, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { FAQCategory, NoticeCategory, NoticeStatus } from "../../enums/notice.enum";
import { TotalCounter } from "../member/member";


@ObjectType()
export class Notice {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => NoticeCategory)
    noticeCategory: NoticeCategory;

    @Field(() => NoticeStatus)
    noticeStatus: NoticeStatus;

    @Field(() => FAQCategory, {nullable: true} )
    faqCategory?: FAQCategory;

    @Field(() => String)
    noticeTitle?:String;

    @Field(() => String, {nullable: true})
    noticeContent:String;

    @Field(() => String, {nullable: true})
    noticeEventDate?:string

    @Field(() => String)
    memberId: ObjectId;

    @Field(() => Date)
    createdAt:Date;

    @Field(() => Date)
    updatedAt:Date;
}

@ObjectType()
export class Notices {
    @Field(() => [Notice])
    list: Notice[];

    @Field(()=> [TotalCounter], {nullable: true})
    metaCounter: TotalCounter[];
}
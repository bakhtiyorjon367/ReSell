import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";
// import { MeLiked } from "../like/like";
// import { MeFollowed } from "../follow/follow";


@ObjectType()
export class Member {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => MemberType)
    memberType: MemberType;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus; 
    
    @Field (() => MemberAuthType)
    memberAuthType: MemberAuthType;

    @Field (() => String)
    memberPhone:string;

    @Field(()=> String)
    memberNick:string;

    memberPassword?:string;

    @Field(()=>String)
    memberImage:string;

    @Field(()=>String, {nullable:true})
    memberAddress?:string;

    @Field(() => Int)
    memberProduct:number;

    @Field(() => Int)
    memberPurchase:number;

    @Field(() => Int)
    memberArticles:number;

    @Field(() => Int)
    memberFollowers:number;

    @Field(() => Int)
    memberFollowings:number;

    @Field(() => Int)
    memberPoints:number;

    @Field(() => Int)
    memberLikes:number;

    @Field(() => Int)
    memberViews:number;

    @Field(() => Int)
    memberComments:number;

    @Field(() => Int)
    memberRank:number;

    @Field(() => Int)
    memberWarnings:number;

    @Field(() => Int)
    memberBlocks:number;

    @Field(() => Date, {nullable: true})
    deletedAt?:Date;

    @Field(() => Date)
    createdAt:Date;

    @Field(() => Date)
    updatedAt:Date;

    //Token__________________
    @Field(()=>String, {nullable:true})
    accessToken?:string;

    // /**aggregate **/
    // @Field(() => [MeLiked ], {nullable: true})
    // meLiked?: MeLiked[];

    // @Field(() => [MeFollowed], {nullable: true})
    // meFollowed?: MeFollowed[];
}//____________________________________________________________________________________________________


// @ObjectType()
// export class TotalCounter {
//     @Field(() => Int, {nullable:true})
//     total:number
// }//____________________________________________________________________________________________________


// @ObjectType()
// export class Members {
//     @Field(() => [Member])
//     list:Member[];

//     @Field(() => [TotalCounter], {nullable:true})
//     metaCounter:TotalCounter[];
// }//____________________________________________________________________________________________________


import { Field, InputType, Int } from "@nestjs/graphql";
import { NotificationGroup, NotificationStatus, NotificationType } from "../../enums/notification.enum";
import { IsNotEmpty, IsOptional, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { Direction } from "../../enums/common.enum";
import { availableCommentSorts } from "../../config";

@InputType()
export class NotificationInput{
    
    @IsNotEmpty()
    @Field(() => NotificationType)
    notificationType:NotificationType;

    @Field(() => NotificationStatus)
    notificationStatus?:NotificationStatus;

    @IsNotEmpty()
    @Field(() => NotificationGroup)
    notificationGroup:NotificationGroup | any;

    @IsNotEmpty()
    @Field(() => String)
    notificationTitle:string;

    @Field(() => String)
    notificationDesc?:string;

    @IsNotEmpty()
	@Field(() => String)
	authorId: ObjectId;

    @IsNotEmpty()
	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => String)
	articleId: ObjectId;
}

@InputType()
export class NotificationInquiry {
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

   @IsOptional()
   @Field(() => Direction, { nullable: true })
   direction?: Direction;
}

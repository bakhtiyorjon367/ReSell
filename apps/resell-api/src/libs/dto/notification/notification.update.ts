import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { CommentStatus } from "../../enums/comment.enum";
import { NotificationStatus } from "../../enums/notification.enum";


@InputType()
export class NotificationUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;

	memberId:ObjectId;
}
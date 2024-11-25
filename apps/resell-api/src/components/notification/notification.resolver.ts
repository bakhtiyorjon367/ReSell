import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { NotificationsInquiry } from '../../libs/dto/notification/notification.input';

@Resolver()
export class NotificationResolver {
    constructor(private readonly notificationService:NotificationService) {}

    @UseGuards(AuthGuard)
    @Mutation(() => Notification)
    public async updateNotification(
        @Args('input') input:NotificationUpdate, 
        @AuthMember('_id') memberId:ObjectId
    ): Promise<Notification>{
        console.log("Mutation: notificationUpdate ");
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.notificationService.updateNotification(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Query(() => Notifications)
    public async getUserNotifications(
        @Args('input') input:NotificationsInquiry, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Notifications>{
        console.log("Query: getUserNotifications");
        return await this.notificationService.getUserNotifications(memberId, input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Notification)
    public async removeNotification
    (@Args('notificationId') input:string):Promise<Notification>{
        console.log("Mutation: removeNotification");
        const productId = shapeIntoMongoObjectId(input);
        return await this.notificationService.removeNotification(productId);
    }
}

import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from '../../libs/dto/notification/notification';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';

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
}

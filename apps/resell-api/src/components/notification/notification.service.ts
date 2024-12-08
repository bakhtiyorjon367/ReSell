import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {  Direction, Message } from '../../libs/enums/common.enum';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationInput, NotificationsInquiry,  } from '../../libs/dto/notification/notification.input';
import {  NotificationStatus } from '../../libs/enums/notification.enum';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { T } from '../../libs/types/common';

@Injectable()
export class NotificationService {
     constructor(@InjectModel ('Notification') private readonly notificationModel: Model<Notification>
    ) {}

    public async createNotification (input:NotificationInput):Promise<Notification>{
        const notification:NotificationInput = {
            notificationType: input.notificationType,
            notificationGroup: input.notificationGroup,
            notificationTitle: input.notificationTitle,
            authorId: input.authorId,
            receiverId: input.receiverId,
            productId: input.productId,
            articleId: input.articleId
        };
        try{
            const result =  this.notificationModel.create(notification);
            return result;
        }catch(err){
            console.log("Error: notificationService",err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    };

    public async deleteNotification(input):Promise<any>{
        const search:any = {
            authorId: input.authorId,
            receiverId: input.receiverId,
            productId: input.productId,
            articleId: input.articleId,

        };
       await this.notificationModel.findOneAndDelete(search).exec();
    };

    public async updateNotification(memberId: ObjectId, input:NotificationUpdate):Promise<Notification>{
        const {_id} = input;
        const result = await this.notificationModel.findOneAndUpdate(
            {
                _id:_id,
                receiverId:memberId
            },
            input,
            {new:true}
        ).exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        return result;
    }

    public async getUserNotifications(memberId:ObjectId, input:NotificationsInquiry):Promise<Notifications> {
        const match: T = {
            receiverId: memberId,
            notificationStatus: input?.search?.notificationStatus ? 
            input.search.notificationStatus : 
            { $in: [NotificationStatus.WAIT, NotificationStatus.READ] }
        };
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };

        const result = await this.notificationModel.
        aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet: {
                    list: [
                        {$skip: (input.page - 1)* input.limit},
                        {$limit: input.limit},
                    ],
                    metaCounter: [{$count: 'total'}],
                },
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    };

    public async removeNotification(notificationId:ObjectId):Promise<Notification> {
        const search : T = {_id: notificationId, notificationStatus: NotificationStatus.READ};
        const result = await this.notificationModel.findOneAndDelete(search).exec();
        if(!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }

      
}

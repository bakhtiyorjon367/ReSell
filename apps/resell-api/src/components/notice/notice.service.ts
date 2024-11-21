import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { Message } from '../../libs/enums/common.enum';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { T } from '../../libs/types/common';

@Injectable()
export class NoticeService {
    constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>,
    ) {}

    public async createNotice(input:NoticeInput):Promise<Notice> {
        try{
            const result = await this.noticeModel.create(input);  
            return result;
        }catch(err){
            console.log("Error: noticeService.model",err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }
    }

    public async updateNotice(memberId:ObjectId, input:NoticeUpdate):Promise<Notice> {
        const search:T= {
            _id: input._id,
            memberId: memberId
        }
        const result = await this.noticeModel.findOneAndUpdate(search, input, {new:true}).exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        return result;
    }

    public async getNotices(memberId:ObjectId, input:NoticesInquiry):Promise<Notices>{
       const {noticeStatus, noticeCategory } = input.search;
       const match:T = {};
        const sort: { [key: string]: 1 | -1 } = {
            createdAt: 1, 
        };

        if(noticeStatus) match.noticeStatus = noticeStatus;
        if(noticeCategory) match.noticeCategory = noticeCategory;

        const result = await this.noticeModel.aggregate([
            {$match:match},
            {$sort:sort},
            {
                $facet:{
                    list: [{ $skip: (input.page -1)* input.limit }, { $limit: input.limit }],
                    metaCounter:[{$count: 'total'}],
                }
            },
        ]).exec();
        if(!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];

    }

    public async removeNotice(noticeId:ObjectId):Promise<Notice> {
        const search : T = {_id: noticeId};
        const result = await this.noticeModel.findOneAndDelete(search).exec();
        if(!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

        return result;
    }
}


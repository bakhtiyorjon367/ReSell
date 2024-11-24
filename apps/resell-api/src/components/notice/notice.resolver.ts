import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { NoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NoticeResolver {
    constructor(private readonly noticeService: NoticeService) {}

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Notice)
    public async createNotice(
        @Args('input') input:NoticeInput, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Notice>{
        console.log("Mutation: createNotice");
        input.memberId = memberId;
        console.log('input-->', input);
        return await this.noticeService.createNotice(input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Notice)
    public async updateNotice(
        @Args('input') input:NoticeUpdate,
        @AuthMember('_id')  memberId: ObjectId
    ):Promise<Notice>{
        console.log('Mutation: noticeUpdate');
        input._id = shapeIntoMongoObjectId(input._id);
        return await this.noticeService.updateNotice(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Notice)
    public async getNotice(
        @Args('noticeId') input:String, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Notice>{
        console.log("Query: getNotice");
        const noticeId = shapeIntoMongoObjectId(input);
        return await this.noticeService.getNotice(memberId, noticeId);
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Notices)
    public async getNotices(
        @Args('input') input:NoticesInquiry, 
        @AuthMember('_id')  memberId: ObjectId 
    ):Promise<Notices>{
        console.log("Query: getNotices");
        return await this.noticeService.getNotices(memberId, input);
    }

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation((returns) => Notice)
    public async removeNotice(@Args('noticeId') input:string):Promise<Notice>{
        console.log("Mutation: removeNotice");
        const noticeId = shapeIntoMongoObjectId(input);
        return await this.noticeService.removeNotice(noticeId);
    }
    
}

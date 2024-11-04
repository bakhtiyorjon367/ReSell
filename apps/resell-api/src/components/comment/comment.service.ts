import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../../libs/dto/comment/comment';
import { MemberService } from '../member/member.service';

@Injectable()
export class CommentService {
    constructor(@InjectModel('Comment') 
    private  boardArticleModel:Model<Comment>,
    private  memberService:MemberService
    ) {}
}

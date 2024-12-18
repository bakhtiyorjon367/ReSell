import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Member, Members } from '../../libs/dto/member/member';
import { LoginInput, MemberInput, GetMembers, MembersInquiry } from '../../libs/dto/member/member.input';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';
import { Follower, Following, MeFollowed } from '../../libs/dto/follow/follow';
import { lookUpAuthMemberLiked } from '../../libs/config';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MemberService {
    constructor(
        @InjectModel ('Member') private readonly memberModel: Model<Member>,
        @InjectModel ('Follow') private readonly followModel: Model<Following | Follower>,
        private authService: AuthService,
        private viewService: ViewService,
        private likeService: LikeService,
        private notificationService:NotificationService,
    ) {}

    public async signup(input:MemberInput):Promise<Member>{
            input.memberPassword = await this.authService.hashPassword(input.memberPassword);               //Hash password
        try{
            const result = await this.memberModel.create(input);
            result.accessToken = await this.authService.createToken(result);     // create ACCESSTOKEN
            return result;
        }catch(err){
            console.log("SignupService Error", err.message);
            throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE)
        }
       
    };/*____________________________________________________________________________________________________*/

    public async login(input: LoginInput):Promise<Member>{
        const { memberNick, memberPassword} = input;
        const response: Member = await this.memberModel
            .findOne({memberNick:memberNick})
            .select("+memberPassword")
            .exec();
            if(!response || response.memberStatus === MemberStatus.DELETE){
                throw new InternalServerErrorException(Message.NO_MEMBER_NICK)
            }else if(response.memberStatus === MemberStatus.BLOCK){
                throw new InternalServerErrorException(Message.BLOCKED_USER)
            }

            const isMatch = await this.authService.comparePasswords(memberPassword,response.memberPassword);  //Comparing Passwords
            if(!isMatch){
                throw new InternalServerErrorException(Message.WRONG_PASSWORD)
            }

            response.accessToken = await this.authService.createToken(response);    // create ACCESSTOKEN
        return response;
    };/*____________________________________________________________________________________________________*/


    public async updateMember(memberId: ObjectId, input:MemberUpdate):Promise<Member>{
        const result: Member = await this.memberModel.findOneAndUpdate(
            {_id:memberId, memberStatus: MemberStatus.ACTIVE},
            input,
            {new:true}
        ).exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
            
        result.accessToken = await this.authService.createToken(result);

        return result;

    };/*____________________________________________________________________________________________________*/


    public async getMember(memberId: ObjectId, targetId: ObjectId):Promise<Member>{
        const search:T ={
            _id:targetId,
            memberStatus:{
               $in:[MemberStatus.ACTIVE,MemberStatus.BLOCK]
            } 
        };
        const targetMember = await this.memberModel.findOne(search).exec();
        if(!targetMember) throw new InternalServerErrorException(Message.NO_MEMBER_NICK);

        if(memberId){
            const viewInput = {
                memberId:memberId,
                viewRefId:targetId,
                viewGroup:ViewGroup.MEMBER
            }
            const newView = await this.viewService.recordView(viewInput);
            if(newView){
                await this.memberModel.findByIdAndUpdate(search, {$inc:{ memberViews: 1}}, {new:true}).exec();
                targetMember.memberViews++;
            }
            //meLiked
            const likeInput = {memberId:memberId, likeRefId:targetId, likeGroup: LikeGroup.MEMBER};
            targetMember.meLiked = await this.likeService.cheekLikeExistence(likeInput);

            //meFollowed
            targetMember.meFollowed = await this.checkSubscription(memberId, targetId);
        }
        return targetMember;
    };
    private async checkSubscription(followerId: ObjectId, followingId: ObjectId): Promise<MeFollowed[]>{
        const result = await this.followModel.findOne({followingId: followingId, followerId: followerId}).exec();
        return result ? [{followingId: followingId, followerId: followerId, myFollowing: true}] : [];
    }/*____________________________________________________________________________________________________*/


    public async getMembers(memberId:ObjectId, input:GetMembers):Promise<Members>{
        const { text } = input.search;
        const match:T = { memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE };
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };
        const metaCounter=0;
        if(text){ match.memberNick = {$regex: new RegExp(text, "i")} };

        const result = await this.memberModel.aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet:{
                    list: [
                        { $skip: (input.page -1)* input.limit }, 
                        { $limit: input.limit },
                        lookUpAuthMemberLiked(memberId,)
                    ],
                    metaCounter:[{$count: 'total'}],
                }
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    };/*____________________________________________________________________________________________________*/


    public async likeTargetMember(memberId: ObjectId, likeRefId: ObjectId):Promise<Member>{
        const target:Member = await this.memberModel.findOne({_id:likeRefId, memberStatus: MemberStatus.ACTIVE});
        if(!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input:LikeInput ={
            memberId:memberId,
            likeRefId:likeRefId,
            likeGroup:LikeGroup.MEMBER
        };
        let modifier:number = await this.likeService.toggleLike(input);
        const result = this.memberStatsEditior({_id:likeRefId, targetKey:'memberLikes', modifier:modifier});

        if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
        
        if(memberId.toString() !== likeRefId.toString()){
            const liker = await this.getMember(null, memberId);
            const notification:NotificationInput= {
                notificationType: NotificationType.LIKE,
                notificationGroup: NotificationGroup.MEMBER,
                notificationTitle: `${liker.memberNick} has liked you`,
                authorId: memberId,
                receiverId: likeRefId,
                productId: null,
                articleId: null
            };
            if(modifier === 1){
               const result =  await this.notificationService.createNotification(notification);
            }else{
                const input = {
                    authorId:memberId, 
                    receiverId:likeRefId, 
                    productId:null,
                    articleId:null
                };
                await this.notificationService.deleteNotification(input);
            }
        }
        
        return result;
    };

    //=========ADMIN===============================================================================================================================================================
    
    public async getAllMembersByAdmin(input:MembersInquiry):Promise<Members>{
        const { memberStatus, memberType, text  } = input.search;
        const match:T = {};
        const sort:T ={ [input?.sort  ?? 'createdAt']: input?.direction ?? Direction.DESC };
        
        if(memberStatus) match.memberStatus = memberStatus;
        if(memberType) match.memberType = memberType;
        if(text){ match.memberNick = {$regex: new RegExp(text, "i")} };

        const result = await this.memberModel.aggregate([
            {$match: match},
            {$sort: sort},
            {
                $facet:{
                    list: [{ $skip: (input.page -1)* input.limit }, { $limit: input.limit }],
                    metaCounter:[{$count: 'total'}],
                }
            },
        ]).exec();
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0];
    };/*____________________________________________________________________________________________________*/


    public async updateMemberByAdmin(input:MemberUpdate):Promise<Member>{
        const result = await this.memberModel.findByIdAndUpdate({_id:input._id}, input, {new: true});
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        
        return result;
    }

    public async memberStatsEditior(input:StatisticModifier):Promise<Member>{
        const {_id, targetKey, modifier } = input;
        return await this.memberModel.findByIdAndUpdate(
            _id,
            {$inc: {[targetKey]:modifier}}, 
            {new:true}
        ).exec();
    }
}


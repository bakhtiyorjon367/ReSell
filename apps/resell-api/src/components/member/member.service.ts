import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class MemberService {
    constructor(@InjectModel ('Member') private readonly memberModel: Model<Member>) {}

    public async signup(input:MemberInput):Promise<Member>{
            //TODO:  Hash password
        try{
            const result = await this.memberModel.create(input);
            // TODO: Authentication via Token
            return result;
        }catch(err){
            console.log("SignupService Error", err.message);
            throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE)
        }
       
    }

    public async login(input: LoginInput):Promise<Member>{
        const { memberNick, memberPassword} = input;
        const response = await this.memberModel
            .findOne({memberNick:memberNick})
            .select("+memberPassword")
            .exec();
            if(!response || response.memberStatus === MemberStatus.DELETED){
                throw new InternalServerErrorException(Message.NO_MEMBER_NICK)
            }else if(response.memberStatus === MemberStatus.BLOCKED){
                throw new InternalServerErrorException(Message.BLOCKED_USER)
            }

            //TODO: Compare Passwords
            const isMatch = memberPassword === response.memberPassword;
            if(!isMatch){
                throw new InternalServerErrorException(Message.WRONG_PASSWORD)
            }
        return response;
     }
}


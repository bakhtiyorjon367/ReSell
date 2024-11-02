import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { UseGuards } from '@nestjs/common';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args('input') input: MemberInput):Promise<Member>{
            console.log("Mutation: signup", input);
            return this.memberService.signup(input);
    }

    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput):Promise<Member>{
            console.log("Mutation: signup");
            return this.memberService.login(input);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @AuthMember('_id') memberId:ObjectId
    ): Promise<String>{
        console.log("Mutation: updateMember ");
        return await this.memberService.updateMember();
    }

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick:string
    ): Promise<string>{
        console.log("Query: checkAuth ");
       
        return `Hi ${memberNick})`;
    }

    @Query(() => String)
    public async getMember():Promise<string>{
        console.log("Query: getMember");
        return "getMember executed"
    }
     //=========ADMIN===============================================================================================================================================================
    
     @Mutation(() => String)
     public async getAllMembersByAdmin(@Args('input') input:string
        ): Promise<String>{
            console.log("Mutation: getAllMembersByAdmin");
        return "getAllMembersByAdmin"
    }
    @Mutation(() => String)
     public async updateMemberByAdmin(@Args('input') input:string
        ): Promise<String>{
            console.log("Mutation: updateMemberByAdmin");
        return "updateMemberByAdmin"
    }
}

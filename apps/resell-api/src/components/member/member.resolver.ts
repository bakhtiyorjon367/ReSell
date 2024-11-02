import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput, GetMembers, MembersInquiry } from '../../libs/dto/member/member.input';
import { UseGuards } from '@nestjs/common';
import { Member, Members } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args('input') input: MemberInput):Promise<Member>{
        console.log("Mutation: signup", input);
        return this.memberService.signup(input);
    };

    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput):Promise<Member>{
        console.log("Mutation: signup");
        return this.memberService.login(input);
    };

    @UseGuards(AuthGuard)
    @Query(() => String)
    public async checkAuth(@AuthMember('memberNick') memberNick:string
    ): Promise<string>{
        console.log("Query: checkAuth ");
        return `Hi ${memberNick})`;
    };

    @Roles(MemberType.ADMIN, MemberType.USER)
    @UseGuards(RolesGuard)
    @Query(() => String)
    public async checkAuthRoles(@AuthMember() authMember:Member
    ): Promise<string>{
        console.log("Query: checkAuthRoles ");
        return `Hi ${authMember.memberNick} you are ${authMember.memberType}, (memberId:${authMember._id})`;
    };

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input:MemberUpdate, 
        @AuthMember('_id') memberId:ObjectId
    ): Promise<Member>{
        console.log("Mutation: updateMember ");
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    };

    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(@Args('memberId') input:string, @AuthMember('_id') memberId: ObjectId
    ): Promise<Member>{
        console.log("Query: getMember ");
        const targetId = shapeIntoMongoObjectId(input);
        return await this.memberService.getMember(memberId, targetId);
    };

    @UseGuards(WithoutGuard)
    @Query(() => Members)
    public async getAllMembers(@Args('input') input:GetMembers, @AuthMember('_id')  memberId: ObjectId
    ):Promise<Members>{
        console.log("Query: getAllMembers ");
        return await this.memberService.getMembers(memberId, input);
    };
     //=========ADMIN===============================================================================================================================================================
    
     @Roles(MemberType.ADMIN)
     @UseGuards(RolesGuard)
     @Query(() => Members)
     public async getAllMembersByAdmin(@Args('input') input:MembersInquiry
    ): Promise<Members>{
        console.log("Query: getAllMembersByAdmin");
         return await this.memberService.getAllMembersByAdmin(input);
    };

    @Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Member)
    public async updateMemberByAdmin(@Args('input') input:MemberUpdate
    ): Promise<Member>{
        console.log("Mutation: updateMemberByAdmin ");
        
        return await this.memberService.updateMemberByAdmin(input);
    }
}

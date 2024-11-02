import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { UseGuards } from '@nestjs/common';
import { Member } from '../../libs/dto/member/member';
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
    }

    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput):Promise<Member>{
        console.log("Mutation: signup");
        return this.memberService.login(input);
    }

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
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input:MemberUpdate, 
        @AuthMember('_id') memberId:ObjectId
    ): Promise<Member>{
        console.log("Mutation: updateMember ");
        delete input._id;
        return await this.memberService.updateMember(memberId, input);
    }

    @UseGuards(WithoutGuard)
    @Query(() => Member)
    public async getMember(@Args('memberId') input:string
    ): Promise<Member>{
        console.log("Query: getMember ");
        const targetId = shapeIntoMongoObjectId(input);
        return await this.memberService.getMember(targetId);
    }
     //=========ADMIN===============================================================================================================================================================
    
     @Roles(MemberType.ADMIN)
     @UseGuards(RolesGuard)
     @Mutation(() => String)
     public async getAllMembersByAdmin(@AuthMember()  member:Member): Promise<string>{
        console.log("Mutation: getAllMembersByAdmin ", member.memberType);
         return await this.memberService.getAllMembersByAdmin();
     }

    @Mutation(() => String)
     public async updateMemberByAdmin(@Args('input') input:string
        ): Promise<String>{
            console.log("Mutation: updateMemberByAdmin");
        return "updateMemberByAdmin"
    }
}

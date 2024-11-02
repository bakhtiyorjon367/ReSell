import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Member } from '../../libs/dto/member/member';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    public async signup(@Args('input') input: MemberInput):Promise<Member>{
        try{
            console.log("Mutation: signup", input);
            return this.memberService.signup(input);
        }catch(err){
            console.log(err);
        }
    }

    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput):Promise<Member>{
        try{
            console.log("Mutation: signup");
            return this.memberService.login(input);
        }catch(err){
            console.log(err);
        }
    }

    @Mutation(() => String)
    public async updateMember():Promise<string>{
        console.log("Mutation: updateMember");
        return "updateMember executed"
    }
}

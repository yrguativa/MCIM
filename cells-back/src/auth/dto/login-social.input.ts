import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginSocialInput {
  @Field()
  @IsNotEmpty()
  @MinLength(6)
  credential: string;
}

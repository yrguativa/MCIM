import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterSocialLoginInput {
  @Field()
  @IsNotEmpty()
  @MinLength(3)
  id: string;

  @Field()
  @IsNotEmpty()
  identification: string;

  @Field()
  @IsNotEmpty()
  ministryId: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: string;
}

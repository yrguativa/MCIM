import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class SocialAuthInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  displayName: string;

  @Field()
  photoURL: string;

  @Field()
  @IsNotEmpty()
  identification: string;

  @Field()
  @IsNotEmpty()
  ministryId: string;

  @Field()
  @IsNotEmpty()
  phoneNumber: string;

  @Field()
  @IsEnum(['google', 'apple'])
  provider: 'google' | 'apple';
}

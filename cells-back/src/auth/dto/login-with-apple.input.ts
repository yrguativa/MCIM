import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

@InputType()
export class LoginWithAppleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  idToken?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}

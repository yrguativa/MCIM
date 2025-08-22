import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

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

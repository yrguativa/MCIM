import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class CompleteSocialRegistrationInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Min(5)
  @Max(20)
  identification: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  ministryId: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}

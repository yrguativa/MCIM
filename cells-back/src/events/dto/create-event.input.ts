import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsDate()
  date: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdBy: string;
}

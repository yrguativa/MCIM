import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateRecordCellInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  topic: string;

  @Field(() => Date)
  @IsDate()
  date: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  mode: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  createdUser: string;

  @Field(() => [CreateAssistantRecordCellInput], { nullable: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAssistantRecordCellInput)
  assistants: CreateAssistantRecordCellInput[];
}

@InputType()
export class CreateAssistantRecordCellInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  disciple: string;
}

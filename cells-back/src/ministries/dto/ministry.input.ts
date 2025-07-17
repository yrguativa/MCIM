import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateMinistryInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  leader?: string;

  @Field(() => ID)
  @IsMongoId()
  createdUser: string;

  @Field(() => Date)
  @IsOptional()
  @IsDate()
  createdDate?: Date;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  parentMinistryId?: string;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

@InputType()
export class UpdateMinistryInput extends CreateMinistryInput {
  @Field(() => ID)
  @IsMongoId()
  id: string;
}

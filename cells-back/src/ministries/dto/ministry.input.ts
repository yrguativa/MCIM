import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateMinistryInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  name: string;

  @Field(() => String)
  @IsString()
  @MinLength(10)
  description: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  parentMinistryId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  leaderId?: string;

  @Field(() => ID)
  @IsUUID()
  createdUserId: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  createdDate?: Date;

  @Field(() => Boolean, { defaultValue: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

@InputType()
export class UpdateMinistryInput extends CreateMinistryInput {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

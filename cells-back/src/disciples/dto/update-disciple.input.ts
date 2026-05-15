import { CreateDiscipleInput } from './create-disciple.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MaxDate,
  MinDate,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class UpdateDiscipleInput extends PartialType(CreateDiscipleInput) {
  @Field(() => String)
  @IsMongoId()
  id: string;

  @Field(() => String)
  @IsNotEmpty()
  identification: string;

  @Field(() => String)
  @IsNotEmpty()
  identificationType: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  network: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  status: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  createdUser: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(new Date(new Date().setDate(new Date().getDate() + 1)))
  @MinDate(new Date('1900-01-01'))
  createdDate: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  updatedUser: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.updatedDate !== undefined)
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  @MaxDate(new Date(new Date().setDate(new Date().getDate() + 1)))
  @MinDate(new Date('1900-01-01'))
  updatedDate: Date;
}

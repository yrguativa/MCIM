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
import { Logger } from '@nestjs/common';

@InputType()
export class UpdateDiscipleInput extends PartialType(CreateDiscipleInput) {
  @Field(() => String)
  @IsMongoId()
  id: string;

  @Field(() => String, { description: 'Identification number' })
  @IsNotEmpty()
  identification: string;

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
  address: string;

  @Field(() => Date, { description: 'DOF (Date OF Birth)', nullable: true })
  @IsOptional()
  @Transform(({ value }) => {
    Logger.log('Transforming birthDate:', value);
    return value ? new Date(value) : undefined;
  })
  @IsDate({ message: 'The date of birth must be a valid date' })
  @MaxDate(new Date(), {
    message: 'The date of birth cannot be in the future',
  })
  @MinDate(new Date('1900-01-01'), {
    message: 'The date of birth is not valid',
  })
  birthDate: string;

  @Field(() => String)
  @IsNotEmpty()
  createdUser: string;

  @Field(() => Date, { description: 'DOF (Date OF Birth)', nullable: false })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'The date of birth must be a valid date' })
  @MaxDate(new Date(new Date().setDate(new Date().getDate() + 1)), {
    message: 'The date of created cannot be in the future',
  })
  @MinDate(new Date('1900-01-01'), {
    message: 'The date of birth is not valid',
  })
  createdDate: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  updatedUser: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @ValidateIf((o) => o.updatedDate !== undefined)
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate({ message: 'The date of updated must be a valid date' })
  @MaxDate(new Date(new Date().setDate(new Date().getDate() + 1)), {
    message: 'The date of updated cannot be in the future',
  })
  @MinDate(new Date('1900-01-01'), {
    message: 'The date of updated is not valid',
  })
  updatedDate: Date;
}

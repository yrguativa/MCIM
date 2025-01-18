import { CreateDiscipleInput } from './create-disciple.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxDate,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class UpdateDiscipleInput extends PartialType(CreateDiscipleInput) {
  @Field(() => String)
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
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'The date of birth must be a valid date' })
  @MaxDate(new Date(), {
    message: 'The date of birth cannot be in the future',
  })
  @MinDate(new Date('1900-01-01'), {
    message: 'The date of birth is not valid',
  })
  @IsOptional()
  birthDate: string;
}

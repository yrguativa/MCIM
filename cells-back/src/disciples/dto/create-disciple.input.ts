import { InputType, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxDate,
  MinDate,
} from 'class-validator';

@InputType()
export class CreateDiscipleInput {
  @Field()
  @IsNotEmpty()
  identification: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsOptional()
  @IsEmail()
  email: string;

  @Field()
  @IsOptional()
  phone: string;

  @Field()
  @IsOptional()
  address: string;

  @Field(() => Date, { description: 'DOF (Date OF Birth)' })
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

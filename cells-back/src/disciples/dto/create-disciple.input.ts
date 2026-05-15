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
  @Field(() => String)
  @IsNotEmpty()
  identification: string;

  @Field(() => String)
  @IsNotEmpty()
  identificationType: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  names: string;

  @Field(() => String, { nullable: true })
  lastNames: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone: string;

  @Field(() => String, { description: 'Ministry ID' })
  @IsNotEmpty({ message: 'The ministry ID is required' })
  ministryId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  leaderId: string;

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
  @MaxDate(new Date())
  @MinDate(new Date('1900-01-01'))
  createdDate: string;
}

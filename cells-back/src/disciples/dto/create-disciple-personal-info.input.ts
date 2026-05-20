import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  MaxDate,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateDisciplePersonalInfoInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  discipleId: string;

  @Field()
  @IsNotEmpty({ message: 'Nationality is required' })
  nationality: string;

  @Field()
  @IsNotEmpty({ message: 'Gender is required' })
  gender: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  maritalStatus: string;

  @Field()
  @IsNotEmpty({ message: 'hasChildren is required' })
  hasChildren: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  childrenAttendChurch: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  housingComplex: string;

  @Field()
  @IsNotEmpty({ message: 'Neighborhood is required' })
  neighborhood: string;

  @Field()
  @IsNotEmpty({ message: 'Municipality is required' })
  municipality: string;

  @Field()
  @IsNotEmpty({ message: 'Network is required' })
  network: string;

  @Field(() => Date)
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'Birth date must be a valid date' })
  @MaxDate(new Date(), { message: 'Birth date cannot be in the future' })
  @MinDate(new Date('1900-01-01'), { message: 'Birth date is not valid' })
  birthDate: Date;

  @Field()
  @IsNotEmpty({ message: 'Ministry ID is required' })
  ministryId: string;

  @Field()
  @IsNotEmpty({ message: 'Year arrived at church is required' })
  yearArrivedAtChurch: string;

  @Field()
  @IsNotEmpty({ message: 'hasAttendedEncounter is required' })
  hasAttendedEncounter: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  yearAttendedEncounter: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  hasRepeatedEncounter: string;

  @Field()
  @IsNotEmpty({ message: 'hasAttendedReencounter is required' })
  hasAttendedReencounter: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  yearAttendedReencounter: string;

  @Field()
  @IsNotEmpty({ message: 'baptizedAtMCI is required' })
  baptizedAtMCI: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  isLeader: string;

  @Field()
  @IsNotEmpty({ message: 'Generation is required' })
  generation: string;

  @Field()
  @IsNotEmpty({ message: 'Formation school level is required' })
  formationSchoolLevel: string;
}

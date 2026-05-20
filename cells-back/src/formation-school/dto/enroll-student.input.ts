import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

@InputType()
export class EnrollStudentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @Field()
  @IsDate()
  enrollmentDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  finalGrade?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateEnrollmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  studentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  enrollmentDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  status?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  finalGrade?: number;
}

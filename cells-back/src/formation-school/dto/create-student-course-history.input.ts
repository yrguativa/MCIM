import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateStudentCourseHistoryInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  enrollmentDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  completionDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  finalGrade?: number;

  @Field()
  @IsIn(['in_progress', 'completed', 'withdrawn'])
  status: 'in_progress' | 'completed' | 'withdrawn';

  @Field()
  @IsBoolean()
  promotedToNextLevel: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateStudentCourseHistoryInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  studentId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  courseId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  completionDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  finalGrade?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['in_progress', 'completed', 'withdrawn'])
  status?: 'in_progress' | 'completed' | 'withdrawn';

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  promotedToNextLevel?: boolean;
}

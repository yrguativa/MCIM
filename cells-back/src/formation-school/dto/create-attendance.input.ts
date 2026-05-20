import { InputType, Field, ID } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';

@InputType()
export class CreateAttendanceInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  studentEnrollmentId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @Field()
  @IsBoolean()
  attended: boolean;

  @Field()
  @IsDate()
  attendanceDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateAttendanceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  studentEnrollmentId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  attended?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  attendanceDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}

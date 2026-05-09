import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsBoolean } from 'class-validator';

@InputType()
export class CreateTeacherAssignmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class EnrollTeacherInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field()
  @IsDate()
  assignedDate: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateTeacherAssignmentInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  teacherId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  courseId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  assignedDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

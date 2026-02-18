import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDate, IsBoolean } from 'class-validator';

@InputType()
export class CreateTeacherAssignmentInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  courseId: string;

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
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  teacherId?: string;

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

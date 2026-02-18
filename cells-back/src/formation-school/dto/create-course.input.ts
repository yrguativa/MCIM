import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

@InputType()
export class CreateCourseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  levelId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  classroomId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  cycleId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  qrCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  qrExpiration?: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateCourseInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  levelId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  teacherId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  classroomId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  scheduleId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cycleId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  qrCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  qrExpiration?: Date;
}

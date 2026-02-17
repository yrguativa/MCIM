import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

@InputType()
export class CreateScheduleInput {
  @Field()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateScheduleInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  startTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  endTime?: string;
}

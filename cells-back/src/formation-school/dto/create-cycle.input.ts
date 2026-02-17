import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateCycleInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsDate()
  startDate: Date;

  @Field()
  @IsDate()
  endDate: Date;

  @Field()
  @IsNumber()
  @Min(1)
  requiredClasses: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  active?: boolean;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateCycleInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  requiredClasses?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  active?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  updatedUser?: string;
}

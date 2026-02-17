import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateLevelInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @Field()
  @IsNumber()
  @Min(1)
  order: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  cycleId: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateLevelInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  cycleId?: string;
}

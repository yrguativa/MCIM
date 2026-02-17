import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateClassroomInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNumber()
  @Min(1)
  capacity: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  location: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateClassroomInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;
}

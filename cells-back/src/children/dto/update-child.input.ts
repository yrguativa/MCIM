import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateChildInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'ID is required' })
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  name: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  age: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  childDiscipleId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['YES', 'NO'], { message: 'attendsChurch must be YES or NO' })
  attendsChurch: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  updatedUser: string;
}

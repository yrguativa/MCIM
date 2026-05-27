import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateChildInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Parent ID is required' })
  parentId: string;

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

  @Field()
  @IsNotEmpty({ message: 'attendsChurch is required' })
  @IsIn(['YES', 'NO'], { message: 'attendsChurch must be YES or NO' })
  attendsChurch: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  createdUser: string;
}

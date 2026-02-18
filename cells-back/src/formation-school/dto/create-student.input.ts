import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  discipleId: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  currentLevelId: string;

  @Field()
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';

  @Field()
  @IsString()
  @IsNotEmpty()
  createdUser: string;
}

@InputType()
export class UpdateStudentInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  discipleId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  currentLevelId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

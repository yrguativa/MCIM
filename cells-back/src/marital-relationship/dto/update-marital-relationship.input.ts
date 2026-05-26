import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

@InputType()
export class UpdateMaritalRelationshipInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'ID is required' })
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsIn(['YES', 'NO'], { message: 'attendsChurch must be YES or NO' })
  attendsChurch: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  spouseId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  spouseName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  updatedUser: string;
}

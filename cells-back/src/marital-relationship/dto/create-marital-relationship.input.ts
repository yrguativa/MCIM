import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

@InputType()
export class CreateMaritalRelationshipInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'Disciple ID is required' })
  discipleId: string;

  @Field()
  @IsNotEmpty({ message: 'attendsChurch is required' })
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
  createdUser: string;
}

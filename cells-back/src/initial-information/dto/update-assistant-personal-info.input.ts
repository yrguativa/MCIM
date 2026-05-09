import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAssistantPersonalInfoInput } from './create-assistant-personal-info.input';
import { IsMongoId, IsOptional } from 'class-validator';

@InputType()
export class UpdateAssistantPersonalInfoInput extends PartialType(CreateAssistantPersonalInfoInput) {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId({ message: 'Invalid personal info ID' })
  id: string;
}

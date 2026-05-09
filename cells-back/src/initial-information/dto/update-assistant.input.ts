import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateAssistantInput } from './create-assistant.input';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateAssistantInput extends PartialType(CreateAssistantInput) {
  @Field(() => String)
  @IsMongoId({ message: 'Invalid assistant ID' })
  id: string;
}

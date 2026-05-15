import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class DeactivateCellAssistantInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  disciple: string;

  @Field(() => String)
  @IsNotEmpty()
  updatedUser: string;
}

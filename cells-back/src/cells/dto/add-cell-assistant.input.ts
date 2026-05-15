import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class AddCellAssistantInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  disciple: string;

  @Field(() => String)
  @IsNotEmpty()
  createdUser: string;
}

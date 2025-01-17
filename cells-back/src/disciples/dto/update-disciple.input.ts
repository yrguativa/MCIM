import { CreateDiscipleInput } from './create-disciple.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDiscipleInput extends PartialType(CreateDiscipleInput) {
  @Field(() => Int)
  id: number;
}

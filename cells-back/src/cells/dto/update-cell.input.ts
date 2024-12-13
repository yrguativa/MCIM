import { CreateCellInput } from './create-cell.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCellInput extends PartialType(CreateCellInput) {
  @Field(() => Int)
  id: number;
}

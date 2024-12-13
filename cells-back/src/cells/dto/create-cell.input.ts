import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCellInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

import { IsMongoId, IsNotEmpty, IsPositive } from 'class-validator';
import { CreateCellInput } from './create-cell.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCellInput extends PartialType(CreateCellInput) {
  @Field(() => String)
  @IsMongoId()
  id: string;

  @Field(() => String)
  @IsNotEmpty()
  leader: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsPositive()
  network: number;

  @Field(() => String, {
    description:
      'Enter the name of the host who will receive the cell in their home.',
  })
  @IsNotEmpty()
  host: string;

  @Field(() => String)
  @IsNotEmpty()
  address: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsPositive()
  neighborhood: number;

  @Field(() => String)
  @IsNotEmpty()
  createdUser: string;
}

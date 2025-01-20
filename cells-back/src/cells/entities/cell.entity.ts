import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType('Cell')
export class CellEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  leader: string;

  @Field(() => Int)
  network: number;

  @Field(() => String, {
    description:
      'Enter the name of the host who will receive the cell in their home.',
  })
  host: string;

  @Field(() => String)
  address: string;

  @Field(() => Int)
  neighborhood: number;

  @Field(() => String)
  createdDate: Date;

  @Field(() => String)
  createdUser: string;
}

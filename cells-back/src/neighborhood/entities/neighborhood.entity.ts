import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Neighborhood')
export class NeighborhoodEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
}

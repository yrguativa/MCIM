import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Leader')
export class LeaderEntity {
  @Field(() => ID)
  id: string;

  @Field()
  names: string;

  @Field()
  lastNames: string;
}

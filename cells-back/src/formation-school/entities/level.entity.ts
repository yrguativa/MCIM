import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class LevelEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  order: number;

  @Field(() => ID)
  cycleId: string;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

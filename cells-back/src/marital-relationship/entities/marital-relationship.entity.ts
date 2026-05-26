import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('MaritalRelationship')
export class MaritalRelationshipEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  discipleId: string;

  @Field()
  attendsChurch: string;

  @Field(() => ID, { nullable: true })
  spouseId: string;

  @Field(() => String, { nullable: true })
  spouseName: string;

  @Field(() => String, { nullable: true })
  createdUser: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  updatedUser: string;

  @Field(() => Date)
  updatedAt: Date;
}

import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType('Child')
export class ChildEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  parentId: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => ID, { nullable: true })
  childDiscipleId: string;

  @Field()
  attendsChurch: string;

  @Field(() => String, { nullable: true })
  createdUser: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => String, { nullable: true })
  updatedUser: string;

  @Field(() => Date)
  updatedAt: Date;
}

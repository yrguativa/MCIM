import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CycleEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => Number, { nullable: true })
  requiredClasses?: number;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;

  @Field({ nullable: true })
  updatedUser?: string;

  @Field({ nullable: true })
  updatedDate?: Date;
}

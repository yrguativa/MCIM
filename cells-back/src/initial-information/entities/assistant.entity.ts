import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Assistant')
export class AssistantEntity {
  @Field(() => ID)
  id: string;

  @Field()
  names: string;

  @Field()
  lastNames: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field()
  phone: string;

  @Field()
  identificationType: string;

  @Field()
  identification: string;

  @Field(() => String, { nullable: true })
  directLeaderId: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

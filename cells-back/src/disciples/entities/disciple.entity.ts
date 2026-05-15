import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Disciple')
export class DiscipleEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  identification: string;

  @Field(() => String, { nullable: true })
  identificationType: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  names: string;

  @Field(() => String, { nullable: true })
  lastNames: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String)
  ministryId: string;

  @Field(() => String, { nullable: true })
  leaderId: string;

  @Field(() => String, { nullable: true })
  network: string;

  @Field(() => String, { nullable: true })
  status: string;

  @Field(() => String, { nullable: true })
  createdUser: string;

  @Field(() => Date, { nullable: true })
  createdDate: Date;

  @Field(() => String, { nullable: true })
  updatedUser: string;

  @Field(() => Date, { nullable: true })
  updatedDate: Date;
}

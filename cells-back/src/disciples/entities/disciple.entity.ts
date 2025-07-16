import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('Disciple')
export class DiscipleEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Example field (placeholder)' })
  identification: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => Date, { nullable: true })
  birthDate: Date;

  @Field(() => String)
  createdUser: string;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => String, { nullable: true })
  updatedUser: string;

  @Field(() => Date, { nullable: true })
  updatedDate: Date;
}

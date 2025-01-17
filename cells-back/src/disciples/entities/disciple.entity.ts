import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Disciple {
  @Field(() => String, { description: 'Example field (placeholder)' })
  identification: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => Date)
  birthDate: Date;
}

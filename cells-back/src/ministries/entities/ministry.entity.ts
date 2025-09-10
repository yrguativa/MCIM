import { Field, ID, ObjectType } from '@nestjs/graphql';
//import { UserEntity } from '../../auth/entities/user.entity';

@ObjectType('Ministry')
export class MinistryEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  createdUser: string;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => Boolean)
  active: boolean;
}

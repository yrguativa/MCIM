import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Users')
export class UserEntity {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  photoURL?: string;

  @Field({ nullable: true })
  identification: string;

  @Field({ nullable: true })
  ministryId: string;

  @Field({ nullable: true })
  phoneNumber: string;

  @Field()
  authProvider: string;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  lastLogin?: Date;

  @Field()
  active: boolean;

  @Field(() => [String], { nullable: true })
  roles: string[];

  @Field({ nullable: true })
  accessToken: string;
}

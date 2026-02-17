import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ClassroomEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  capacity: number;

  @Field()
  location: string;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

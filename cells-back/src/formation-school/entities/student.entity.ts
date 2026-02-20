import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StudentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  discipleId: string;

  @Field({ nullable: true })
  disciple?: { id: string; name: string; lastName: string; identification: string };

  @Field(() => ID)
  currentLevelId: string;

  @Field()
  status: 'active' | 'inactive';

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

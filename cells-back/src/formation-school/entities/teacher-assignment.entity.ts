import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TeacherAssignmentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  teacherId: string;

  @Field(() => ID)
  courseId: string;

  @Field()
  assignedDate: Date;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

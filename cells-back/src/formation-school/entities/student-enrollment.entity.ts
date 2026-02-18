import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StudentEnrollmentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentId: string;

  @Field(() => ID)
  courseId: string;

  @Field()
  enrollmentDate: Date;

  @Field()
  status: string;

  @Field({ nullable: true })
  finalGrade?: number;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

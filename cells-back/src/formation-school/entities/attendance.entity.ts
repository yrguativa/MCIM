import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class AttendanceEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentEnrollmentId: string;

  @Field(() => ID)
  courseId: string;

  @Field()
  attended: boolean;

  @Field()
  attendanceDate: Date;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

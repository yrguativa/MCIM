import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StudentCourseHistoryEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  studentId: string;

  @Field(() => ID)
  courseId: string;

  @Field()
  enrollmentDate: Date;

  @Field({ nullable: true })
  completionDate?: Date;

  @Field({ nullable: true })
  finalGrade?: number;

  @Field()
  status: 'in_progress' | 'completed' | 'withdrawn';

  @Field()
  promotedToNextLevel: boolean;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

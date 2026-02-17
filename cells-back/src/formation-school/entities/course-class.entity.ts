import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class CourseClassEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  levelId: string;

  @Field(() => ID)
  teacherId: string;

  @Field(() => ID)
  classroomId: string;

  @Field(() => ID)
  scheduleId: string;

  @Field(() => ID)
  cycleId: string;

  @Field({ nullable: true })
  qrCode?: string;

  @Field({ nullable: true })
  qrExpiration?: Date;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ScheduleEntity {
  @Field(() => ID)
  id: string;

  @Field()
  dayOfWeek: number;

  @Field()
  startTime: string;

  @Field()
  endTime: string;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

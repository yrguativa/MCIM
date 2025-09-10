import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EventAttendanceEntity } from './event-attendance.entity';
import { MinistryEntity } from '../../ministries/entities/ministry.entity';

@ObjectType()
export class EventEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  startTime: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field(() => ID, { nullable: true })
  ministryId: string;

  @Field()
  location: string;

  @Field({ nullable: true })
  capacity?: number;

  @Field(() => String)
  createdUser: string;

  @Field(() => ID)
  createdUserId: string;

  @Field()
  createdDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Boolean)
  active: boolean;

  @Field(() => MinistryEntity, { nullable: true })
  ministry: MinistryEntity;

  @Field(() => [EventAttendanceEntity], { nullable: true })
  attendees?: EventAttendanceEntity[];
}

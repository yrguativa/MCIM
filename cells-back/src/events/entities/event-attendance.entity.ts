import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Disciple } from '../../disciples/entities/disciple.entity';

@Entity('event_attendances')
@ObjectType()
export class EventAttendance {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Event, (event) => event.attendances)
  @Field(() => Event)
  event: Event;

  @Column()
  @Field()
  eventId: string;

  @ManyToOne(() => Disciple)
  @Field(() => Disciple)
  disciple: Disciple;

  @Column()
  @Field()
  discipleId: string;

  @CreateDateColumn()
  @Field()
  timestamp: Date;
}

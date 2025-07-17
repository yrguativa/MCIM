import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';
import { DiscipleEntity } from '../../disciples/entities/disciple.entity';

@Entity('event_attendances')
@ObjectType()
export class EventAttendanceEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => EventEntity, (event) => event.attendees)
  @Field(() => EventEntity)
  event: EventEntity;

  @Column()
  @Field()
  eventId: string;

  @ManyToOne(() => DiscipleEntity)
  @Field(() => DiscipleEntity)
  disciple: DiscipleEntity;

  @Column({ name: 'disciple_id' })
  @Field()
  discipleId: string;

  @CreateDateColumn()
  @Field()
  timestamp: Date;
}

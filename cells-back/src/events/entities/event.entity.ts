import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventAttendance } from './event-attendance.entity';

@Entity('events')
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @Column({ type: 'timestamp' })
  @Field()
  date: Date;

  @Column()
  @Field()
  location: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  capacity?: number;

  @OneToMany(() => EventAttendance, (attendance) => attendance.event)
  @Field(() => [EventAttendance])
  attendances: EventAttendance[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}

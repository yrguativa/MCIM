import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventAttendanceEntity } from './event-attendance.entity';
import { MinistryEntity } from '../../ministries/entities/ministry.entity';

@Entity('events')
@ObjectType()
export class EventEntity {
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

  @Column({ type: 'timestamp' })
  @Field()
  startTime: Date;

  @Column({ type: 'timestamp' })
  @Field({ nullable: true })
  endTime?: Date;

  @ManyToOne(() => MinistryEntity)
  @Field(() => MinistryEntity)
  ministry: MinistryEntity;

  @Column({ name: 'ministry_id' })
  @Field(() => ID)
  ministryId: string;

  @Column()
  @Field()
  location: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  capacity?: number;

  @Field(() => String)
  createdUser: string;

  @Column({ name: 'created_user_id' })
  @Field(() => ID)
  createdUserId: string;

  @CreateDateColumn({ name: 'created_date' })
  @Field()
  createdDate: Date;

  @OneToMany(() => EventAttendanceEntity, (attendance) => attendance.event)
  @Field(() => [EventAttendanceEntity], { nullable: true })
  attendees?: EventAttendanceEntity[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column({ default: true })
  @Field(() => Boolean)
  active: boolean;
}

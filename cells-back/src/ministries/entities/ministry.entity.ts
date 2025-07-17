import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ministries' })
@ObjectType()
export class Ministry {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column()
  @Field(() => String)
  description: string;

  @ManyToOne(() => Ministry, ministry => ministry.subMinistries, { nullable: true })
  @JoinColumn({ name: 'parent_ministry_id' })
  @Field(() => Ministry, { nullable: true })
  parentMinistry?: Ministry;

  @Column({ name: 'parent_ministry_id', nullable: true })
  @Field(() => ID, { nullable: true })
  parentMinistryId?: string;

  @OneToMany(() => Ministry, ministry => ministry.parentMinistry)
  @Field(() => [Ministry], { nullable: true })
  subMinistries?: Ministry[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'leader_id' })
  @Field(() => User, { nullable: true })
  leader?: User;

  @Column({ name: 'leader_id', nullable: true })
  @Field(() => ID, { nullable: true })
  leaderId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_user_id' })
  @Field(() => User)
  createdUser: User;

  @Column({ name: 'created_user_id' })
  @Field(() => ID)
  createdUserId: string;

  @CreateDateColumn({ name: 'created_date' })
  @Field(() => Date)
  createdDate: Date;

  @Column({ default: true })
  @Field(() => Boolean)
  active: boolean;
}

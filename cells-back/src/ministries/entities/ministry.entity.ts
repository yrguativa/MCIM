import { Field, ID, ObjectType } from '@nestjs/graphql';
//import { UserEntity } from '../../auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Ministry')
@ObjectType('Ministry')
export class MinistryEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @ManyToOne(() => MinistryEntity, (ministry) => ministry.subMinistries, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_ministry_id' })
  @Field(() => MinistryEntity, { nullable: true })
  parentMinistry?: MinistryEntity;

  @Column({ name: 'parent_ministry_id', nullable: true })
  @Field(() => ID, { nullable: true })
  parentMinistryId?: string;

  @OneToMany(() => MinistryEntity, (ministry) => ministry.parentMinistry)
  @Field(() => [MinistryEntity], { nullable: true })
  subMinistries?: MinistryEntity[];

  //@ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'leader_id' })
  @Field(() => String, { nullable: true })
  leader?: string;

  @Column({ name: 'leader_id', nullable: true })
  @Field(() => ID, { nullable: true })
  leaderId?: string;

  @JoinColumn({ name: 'created_user' })
  @Field(() => String)
  createdUser: string;

  @CreateDateColumn({ name: 'created_date' })
  @Field(() => Date)
  createdDate: Date;

  @Column({ default: true })
  @Field(() => Boolean)
  active: boolean;
}

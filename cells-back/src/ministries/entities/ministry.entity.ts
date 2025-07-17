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

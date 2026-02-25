import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

registerEnumType(StudentStatus, { name: 'StudentStatus' });

@ObjectType()
export class StudentEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  discipleId: string;

  @Field({ nullable: true })
  discipleName?: string;

  @Field(() => ID)
  currentLevelId: string;

  @Field(() => StudentStatus)
  status: StudentStatus;

  @Field(() => String)
  createdUser: string;

  @Field()
  createdDate: Date;
}

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('AssistantPersonalInfo')
export class AssistantPersonalInfoEntity {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  assistantId: string;

  @Field()
  nationality: string;

  @Field()
  gender: string;

  @Field(() => String, { nullable: true })
  maritalStatus: string;

  @Field()
  hasChildren: string;

  @Field(() => String, { nullable: true })
  childrenAttendChurch: string;

  @Field()
  address: string;

  @Field(() => String, { nullable: true })
  housingComplex: string;

  @Field()
  neighborhood: string;

  @Field()
  municipality: string;

  @Field()
  network: string;

  @Field(() => Date)
  birthDate: Date;

  @Field()
  ministryId: string;

  @Field()
  yearArrivedAtChurch: string;

  @Field()
  hasAttendedEncounter: string;

  @Field(() => String, { nullable: true })
  yearAttendedEncounter: string;

  @Field(() => String, { nullable: true })
  hasRepeatedEncounter: string;

  @Field()
  hasAttendedReencounter: string;

  @Field(() => String, { nullable: true })
  yearAttendedReencounter: string;

  @Field()
  baptizedAtMCI: string;

  @Field(() => String, { nullable: true })
  isLeader: string;

  @Field()
  generation: string;

  @Field()
  formationSchoolLevel: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

import { ObjectType, Field } from '@nestjs/graphql';
import { DiscipleEntity } from './disciple.entity';
import { DisciplePersonalInfoEntity } from './disciple-personal-info.entity';

@ObjectType('DiscipleFull')
export class DiscipleFullEntity {
  @Field(() => DiscipleEntity)
  disciple: DiscipleEntity;

  @Field(() => DisciplePersonalInfoEntity, { nullable: true })
  personalInfo: DisciplePersonalInfoEntity;
}

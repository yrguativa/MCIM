import { ObjectType, Field, ID } from '@nestjs/graphql';

import { DiscipleEntity } from '../../disciples/entities/disciple.entity';

@ObjectType()
export class EventAttendanceEntity {
  @Field(() => ID)
  id: string;

  @Field(() => DiscipleEntity)
  disciple: DiscipleEntity;

  @Field()
  discipleId: string;

  @Field()
  dateRegister: Date;
}

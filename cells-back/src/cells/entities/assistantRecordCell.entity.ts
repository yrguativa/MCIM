import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('AssistantRecordCell')
export class AssistantRecordCellEntity {
  @Field(() => String)
  name: string;

  @Field(() => String)
  disciple: string;
}

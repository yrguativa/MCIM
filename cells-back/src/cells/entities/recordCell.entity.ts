import { ObjectType, Field } from '@nestjs/graphql';
import { AssistantRecordCellEntity } from './assistantRecordCell.entity';

@ObjectType('RecordCell')
export class RecordCellEntity {
  @Field(() => String)
  topic: string;

  @Field(() => Date)
  date: Date;

  @Field(() => String)
  createdUser: string;

  @Field(() => [AssistantRecordCellEntity], { nullable: true })
  assistants: AssistantRecordCellEntity[];
}

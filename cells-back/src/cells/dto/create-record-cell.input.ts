import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CreateRecordCellInput {
  @Field(() => String)
  topic: string;

  @Field(() => Date)
  date: Date;

  @Field(() => String)
  createdUser: string;

  @Field(() => [CreateAssistantRecordCellInput], { nullable: true })
  assistants: CreateAssistantRecordCellInput[];
}

export class CreateAssistantRecordCellInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  disciple: string;
}

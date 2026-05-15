import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('CellAssistant')
export class CellAssistantEntity {
  @Field(() => String)
  disciple: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  createdDate: Date;

  @Field(() => String)
  createdUser: string;

  @Field(() => Date)
  updatedDate: Date;

  @Field(() => String)
  updatedUser: string;
}

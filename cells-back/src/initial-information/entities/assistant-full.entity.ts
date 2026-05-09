import { ObjectType, Field } from '@nestjs/graphql';
import { AssistantEntity } from './assistant.entity';
import { AssistantPersonalInfoEntity } from './assistant-personal-info.entity';

@ObjectType('AssistantFull')
export class AssistantFullEntity {
  @Field(() => AssistantEntity)
  assistant: AssistantEntity;

  @Field(() => AssistantPersonalInfoEntity, { nullable: true })
  personalInfo: AssistantPersonalInfoEntity;
}

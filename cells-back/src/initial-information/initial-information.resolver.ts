import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { InitialInformationService } from './initial-information.service';
import { AssistantEntity } from './entities/assistant.entity';
import { AssistantFullEntity } from './entities/assistant-full.entity';
import { LeaderEntity } from './entities/leader.entity';
import { CreateAssistantInput } from './dto/create-assistant.input';
import { UpdateAssistantInput } from './dto/update-assistant.input';
import { CreateAssistantPersonalInfoInput } from './dto/create-assistant-personal-info.input';
import { UpdateAssistantPersonalInfoInput } from './dto/update-assistant-personal-info.input';

@Resolver()
export class InitialInformationResolver {
  constructor(private readonly service: InitialInformationService) {}

  @Query(() => AssistantFullEntity, { nullable: true, name: 'assistantByIdentification' })
  async findAssistantByIdentification(
    @Args('identification', { type: () => String }) identification: string,
  ) {
    return this.service.findByIdentification(identification);
  }

  @Query(() => [LeaderEntity], { name: 'assistantLeaders' })
  async assistantLeaders() {
    return this.service.findLeaders();
  }

  @Mutation(() => AssistantEntity)
  async createAssistant(
    @Args('createAssistantInput') createAssistantInput: CreateAssistantInput,
    @Args('createPersonalInfoInput') createPersonalInfoInput: CreateAssistantPersonalInfoInput,
  ) {
    return this.service.create(createAssistantInput, createPersonalInfoInput);
  }

  @Mutation(() => AssistantEntity)
  async updateAssistant(
    @Args('updateAssistantInput') updateAssistantInput: UpdateAssistantInput,
    @Args('updatePersonalInfoInput', { nullable: true })
    updatePersonalInfoInput: UpdateAssistantPersonalInfoInput,
  ) {
    return this.service.update(
      updateAssistantInput.id,
      updateAssistantInput,
      updatePersonalInfoInput,
    );
  }
}

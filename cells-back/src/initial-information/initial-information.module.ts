import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InitialInformationService } from './initial-information.service';
import { InitialInformationResolver } from './initial-information.resolver';
import { Assistant, AssistantSchema } from './schemas/assistant.schema';
import {
  AssistantPersonalInfo,
  AssistantPersonalInfoSchema,
} from './schemas/assistant-personal-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assistant.name, schema: AssistantSchema },
      { name: AssistantPersonalInfo.name, schema: AssistantPersonalInfoSchema },
    ]),
  ],
  providers: [InitialInformationResolver, InitialInformationService],
})
export class InitialInformationModule {}

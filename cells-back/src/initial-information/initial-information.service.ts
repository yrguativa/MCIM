import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assistant } from './schemas/assistant.schema';
import { AssistantPersonalInfo } from './schemas/assistant-personal-info.schema';
import { AssistantEntity } from './entities/assistant.entity';
import { AssistantPersonalInfoEntity } from './entities/assistant-personal-info.entity';
import { AssistantFullEntity } from './entities/assistant-full.entity';
import { LeaderEntity } from './entities/leader.entity';
import { CreateAssistantInput } from './dto/create-assistant.input';
import { UpdateAssistantInput } from './dto/update-assistant.input';
import { CreateAssistantPersonalInfoInput } from './dto/create-assistant-personal-info.input';
import { UpdateAssistantPersonalInfoInput } from './dto/update-assistant-personal-info.input';
import { Logger } from '@nestjs/common';

@Injectable()
export class InitialInformationService {
  constructor(
    @InjectModel(Assistant.name) private assistantModel: Model<Assistant>,
    @InjectModel(AssistantPersonalInfo.name)
    private personalInfoModel: Model<AssistantPersonalInfo>,
  ) {}

  async findByIdentification(
    identification: string,
  ): Promise<AssistantFullEntity | null> {
    const assistant = await this.assistantModel.findOne({ identification }).exec();
    if (!assistant) {
      return null;
    }

    const personalInfo = await this.personalInfoModel
      .findOne({ assistantId: assistant._id.toString() })
      .exec();

    return {
      assistant: this.toAssistantModel(assistant),
      personalInfo: personalInfo ? this.toPersonalInfoModel(personalInfo) : null,
    };
  }

  async findLeaders(): Promise<LeaderEntity[]> {
    const leaderInfos = await this.personalInfoModel
      .find({ isLeader: 'YES' })
      .select('assistantId')
      .lean()
      .exec();

    const assistantIds = leaderInfos.map((l) => l.assistantId);
    const leaders = await this.assistantModel
      .find({ _id: { $in: assistantIds } })
      .select('names lastNames')
      .lean()
      .exec();

    return leaders.map((l) => ({
      id: l._id.toString(),
      names: l.names,
      lastNames: l.lastNames,
    }));
  }

  async create(
    createInput: CreateAssistantInput,
    personalInput: CreateAssistantPersonalInfoInput,
  ): Promise<AssistantEntity> {
    const createdAssistant = new this.assistantModel(createInput);
    const savedAssistant = await createdAssistant.save();

    personalInput.assistantId = savedAssistant._id.toString();
    const createdPersonalInfo = new this.personalInfoModel(personalInput);
    await createdPersonalInfo.save();

    Logger.log('Assistant created:', savedAssistant._id.toString());
    return this.toAssistantModel(savedAssistant);
  }

  async update(
    id: string,
    updateInput: UpdateAssistantInput,
    personalInput?: UpdateAssistantPersonalInfoInput,
  ): Promise<AssistantEntity> {
    const updatedAssistant = await this.assistantModel
      .findByIdAndUpdate(id, { $set: updateInput }, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!updatedAssistant) {
      throw new NotFoundException(`Assistant with ID ${id} not found`);
    }

    if (personalInput) {
      const { id: personalInfoId, ...personalData } = personalInput;

      if (personalInfoId) {
        await this.personalInfoModel
          .findByIdAndUpdate(personalInfoId, { $set: personalData }, { new: true, runValidators: true })
          .lean()
          .exec();
      } else {
        const existing = await this.personalInfoModel
          .findOne({ assistantId: id })
          .exec();

        if (existing) {
          await this.personalInfoModel
            .findByIdAndUpdate(existing._id.toString(), { $set: personalData }, { new: true, runValidators: true })
            .lean()
            .exec();
        } else {
          const newPersonalInfo = new this.personalInfoModel({
            ...personalData,
            assistantId: id,
          });
          await newPersonalInfo.save();
        }
      }
    }

    return this.toAssistantModel(updatedAssistant);
  }

  private toAssistantModel(assistant: Assistant): AssistantEntity {
    return {
      id: assistant._id.toString(),
      names: assistant.names,
      lastNames: assistant.lastNames,
      email: assistant.email,
      phone: assistant.phone,
      identificationType: assistant.identificationType,
      identification: assistant.identification,
      directLeaderId: assistant.directLeaderId,
      createdAt: assistant.createdAt,
      updatedAt: assistant.updatedAt,
    };
  }

  private toPersonalInfoModel(info: AssistantPersonalInfo): AssistantPersonalInfoEntity {
    return {
      id: info._id.toString(),
      assistantId: info.assistantId,
      nationality: info.nationality,
      gender: info.gender,
      maritalStatus: info.maritalStatus,
      hasChildren: info.hasChildren,
      childrenAttendChurch: info.childrenAttendChurch,
      address: info.address,
      housingComplex: info.housingComplex,
      neighborhood: info.neighborhood,
      municipality: info.municipality,
      network: info.network,
      birthDate: info.birthDate,
      ministryId: info.ministryId,
      yearArrivedAtChurch: info.yearArrivedAtChurch,
      hasAttendedEncounter: info.hasAttendedEncounter,
      yearAttendedEncounter: info.yearAttendedEncounter,
      hasRepeatedEncounter: info.hasRepeatedEncounter,
      hasAttendedReencounter: info.hasAttendedReencounter,
      yearAttendedReencounter: info.yearAttendedReencounter,
      baptizedAtMCI: info.baptizedAtMCI,
      isLeader: info.isLeader,
      generation: info.generation,
      formationSchoolLevel: info.formationSchoolLevel,
      createdAt: info.createdAt,
      updatedAt: info.updatedAt,
    };
  }
}

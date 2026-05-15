import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disciple } from './schemas/disciple.schema';
import { DisciplePersonalInfo } from './schemas/disciple-personal-info.schema';
import { UpdateDiscipleInput } from './dto/update-disciple.input';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { CreateDisciplePersonalInfoInput } from './dto/create-disciple-personal-info.input';
import { UpdateDisciplePersonalInfoInput } from './dto/update-disciple-personal-info.input';
import { DiscipleEntity } from './entities/disciple.entity';
import { DisciplePersonalInfoEntity } from './entities/disciple-personal-info.entity';
import { DiscipleFullEntity } from './entities/disciple-full.entity';
import { LeaderEntity } from './entities/leader.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class DisciplesService {
  constructor(
    @InjectModel(Disciple.name) private discipleModel: Model<Disciple>,
    @InjectModel(DisciplePersonalInfo.name)
    private personalInfoModel: Model<DisciplePersonalInfo>,
  ) { }

  async create(createUserInput: CreateDiscipleInput): Promise<DiscipleEntity> {
    if (!createUserInput.createdDate) {
      createUserInput.createdDate = new Date().toISOString();
    }
    const createdDisciple = new this.discipleModel(createUserInput);
    const savedDisciple = await createdDisciple.save();
    return this.toModel(savedDisciple);
  }

  async createFull(
    createDiscipleInput: CreateDiscipleInput,
    createPersonalInfoInput: CreateDisciplePersonalInfoInput,
  ): Promise<DiscipleEntity> {
    if (!createDiscipleInput.createdDate) {
      createDiscipleInput.createdDate = new Date().toISOString();
    }
    const createdDisciple = new this.discipleModel(createDiscipleInput);
    const savedDisciple = await createdDisciple.save();

    createPersonalInfoInput.discipleId = savedDisciple._id.toString();
    const createdPersonalInfo = new this.personalInfoModel(createPersonalInfoInput);
    await createdPersonalInfo.save();

    Logger.log('Disciple created with personal info:', savedDisciple._id.toString());
    return this.toModel(savedDisciple);
  }

  async findAll(): Promise<DiscipleEntity[]> {
    const disciples = await this.discipleModel.find().exec();
    return disciples.map((dis) => this.toModel(dis));
  }

  async findOne(id: string): Promise<DiscipleEntity> {
    const user = await this.discipleModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
    }
    return this.toModel(user);
  }

  async findByIdentification(identification: string): Promise<DiscipleFullEntity | null> {
    const disciple = await this.discipleModel.findOne({ identification }).exec();
    if (!disciple) {
      return null;
    }

    const personalInfo = await this.personalInfoModel
      .findOne({ discipleId: disciple._id.toString() })
      .exec();

    return {
      disciple: this.toModel(disciple),
      personalInfo: personalInfo ? this.toPersonalInfoModel(personalInfo) : null,
    };
  }

  async findLeaders(): Promise<LeaderEntity[]> {
    const disciples = await this.discipleModel
      .find()
      .select('name lastName names lastNames')
      .lean()
      .exec();

    return disciples.map((l) => ({
      id: l._id.toString(),
      names: l.names || l.name || '',
      lastNames: l.lastNames || l.lastName || '',
    }));
  }

  async findPersonalInfo(discipleId: string): Promise<DisciplePersonalInfoEntity | null> {
    const info = await this.personalInfoModel
      .findOne({ discipleId })
      .exec();
    return info ? this.toPersonalInfoModel(info) : null;
  }

  async update(
    id: string,
    updateDiscipleInput: UpdateDiscipleInput,
  ): Promise<DiscipleEntity> {
    const updatedDisciple = await this.discipleModel
      .findByIdAndUpdate(
        id,
        { $set: updateDiscipleInput },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!updatedDisciple) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
    }

    return this.toModel(updatedDisciple);
  }

  async updateFull(
    id: string,
    updateDiscipleInput: UpdateDiscipleInput,
    personalInput?: UpdateDisciplePersonalInfoInput,
  ): Promise<DiscipleEntity> {
    const updatedDisciple = await this.discipleModel
      .findByIdAndUpdate(id, { $set: updateDiscipleInput }, { new: true, runValidators: true })
      .lean()
      .exec();

    if (!updatedDisciple) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
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
          .findOne({ discipleId: id })
          .exec();

        if (existing) {
          await this.personalInfoModel
            .findByIdAndUpdate(existing._id.toString(), { $set: personalData }, { new: true, runValidators: true })
            .lean()
            .exec();
        } else {
          const newPersonalInfo = new this.personalInfoModel({
            ...personalData,
            discipleId: id,
          });
          await newPersonalInfo.save();
        }
      }
    }

    return this.toModel(updatedDisciple);
  }

  async remove(id: string): Promise<DiscipleEntity> {
    const deletedDisciple = await this.discipleModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedDisciple) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
    }

    await this.personalInfoModel.deleteMany({ discipleId: id }).exec();

    return this.toModel(deletedDisciple);
  }

  async searchByName(name: string): Promise<DiscipleEntity[]> {
    const disciples = await this.discipleModel
      .find({
        $or: [
          { name: { $regex: name, $options: 'i' } },
          { lastName: { $regex: name, $options: 'i' } },
        ],
      })
      .limit(10)
      .exec();

    return disciples.map((disciple) => this.toModel(disciple));
  }

  private toModel(disciple: Disciple): DiscipleEntity {
    return {
      id: disciple._id.toString(),
      identification: disciple.identification,
      identificationType: disciple.identificationType,
      name: disciple.name,
      lastName: disciple.lastName,
      names: disciple.names,
      lastNames: disciple.lastNames,
      email: disciple.email,
      phone: disciple.phone,
      ministryId: disciple.ministryId,
      leaderId: disciple.leaderId,
      network: disciple.network,
      status: disciple.status,
      createdUser: disciple.createdUser,
      createdDate: disciple.createdDate,
      updatedUser: disciple.updatedUser,
      updatedDate: disciple.updatedDate,
    };
  }

  private toPersonalInfoModel(info: DisciplePersonalInfo): DisciplePersonalInfoEntity {
    return {
      id: info._id.toString(),
      discipleId: info.discipleId,
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

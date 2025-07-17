import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ministry } from './schemas/ministry.schema';
import { MinistryEntity } from './entities/ministry.entity';
import { CreateMinistryInput, UpdateMinistryInput } from './dto/ministry.input';

@Injectable()
export class MinistriesService {
  constructor(
    @InjectModel(Ministry.name) private ministryModel: Model<Ministry>,
  ) {}

  async create(
    createMinistryInput: CreateMinistryInput,
  ): Promise<MinistryEntity> {
    const createdMinistry = new this.ministryModel(createMinistryInput);
    const savedMinistry = await createdMinistry.save();
    return this.toModel(savedMinistry);
  }

  async findAll(): Promise<MinistryEntity[]> {
    const ministries = await this.ministryModel.find().exec();
    return ministries.map((ministry) => this.toModel(ministry));
  }

  async findOne(id: string): Promise<MinistryEntity> {
    const ministry = await this.ministryModel.findById(id).exec();

    if (!ministry) {
      throw new NotFoundException(`Ministry with ID ${id} not found`);
    }

    return this.toModel(ministry);
  }

  async update(
    id: string,
    updateMinistryInput: UpdateMinistryInput,
  ): Promise<MinistryEntity> {
    const updatedMinistry = await this.ministryModel
      .findByIdAndUpdate(
        id,
        { $set: updateMinistryInput },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedMinistry) {
      throw new NotFoundException(`Ministry with ID ${id} not found`);
    }

    return this.toModel(updatedMinistry);
  }

  async remove(id: string): Promise<MinistryEntity> {
    const deletedMinistry = await this.ministryModel
      .findByIdAndDelete(id)
      .lean()
      .exec();

    if (!deletedMinistry) {
      throw new NotFoundException(`Ministry with ID ${id} not found`);
    }

    return this.toModel(deletedMinistry);
  }

  async findSubMinistries(ministryId: string): Promise<MinistryEntity[]> {
    const subMinistries = await this.ministryModel
      .find({ parentMinistry: ministryId })
      .exec();
    return subMinistries.map((ministry) => this.toModel(ministry));
  }

  private toModel(ministry: Ministry): MinistryEntity {
    return {
      id: ministry._id.toString(),
      name: ministry.name,
      createdUser: ministry.createdUser,
      createdDate: ministry.createdDate,
      active: ministry.active,
    };
  }
}

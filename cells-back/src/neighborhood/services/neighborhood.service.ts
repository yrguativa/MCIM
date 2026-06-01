import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Neighborhood } from '../schemas/neighborhood.schema';
import { NeighborhoodEntity } from '../entities/neighborhood.entity';
import { CreateNeighborhoodInput } from '../dto/create-neighborhood.input';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectModel(Neighborhood.name) private neighborhoodModel: Model<Neighborhood>,
  ) {}

  async findAll(): Promise<NeighborhoodEntity[]> {
    const items = await this.neighborhoodModel.find().sort({ name: 1 }).exec();
    return items.map((item) => this.toEntity(item));
  }

  async findOne(id: string): Promise<NeighborhoodEntity> {
    const item = await this.neighborhoodModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Neighborhood with ID ${id} not found`);
    }
    return this.toEntity(item);
  }

  async create(input: CreateNeighborhoodInput): Promise<NeighborhoodEntity> {
    const created = new this.neighborhoodModel({ name: input.name });
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findOrCreate(name: string): Promise<NeighborhoodEntity> {
    const trimmed = name.trim().toUpperCase();
    const existing = await this.neighborhoodModel
      .findOne({ name: { $regex: new RegExp(`^${trimmed}$`, 'i') } })
      .exec();
    if (existing) {
      return this.toEntity(existing);
    }
    return this.create({ name: trimmed });
  }

  private toEntity(item: any): NeighborhoodEntity {
    return {
      id: item._id.toString(),
      name: item.name,
    };
  }
}

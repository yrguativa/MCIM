import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MaritalRelationship } from '../schemas/marital-relationship.schema';
import { CreateMaritalRelationshipInput } from '../dto/create-marital-relationship.input';
import { UpdateMaritalRelationshipInput } from '../dto/update-marital-relationship.input';

@Injectable()
export class MaritalRelationshipService {
  constructor(
    @InjectModel(MaritalRelationship.name)
    private model: Model<MaritalRelationship>,
  ) {}

  async create(input: CreateMaritalRelationshipInput): Promise<MaritalRelationship> {
    const created = new this.model(input);
    return created.save();
  }

  async update(input: UpdateMaritalRelationshipInput): Promise<MaritalRelationship> {
    const { id, ...data } = input;
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async findByDisciple(discipleId: string): Promise<MaritalRelationship> {
    return this.model.findOne({ discipleId }).exec();
  }

  async delete(id: string): Promise<MaritalRelationship> {
    return this.model.findByIdAndDelete(id).exec();
  }
}

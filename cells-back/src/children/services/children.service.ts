import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Child } from '../schemas/child.schema';
import { CreateChildInput } from '../dto/create-child.input';
import { UpdateChildInput } from '../dto/update-child.input';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectModel(Child.name)
    private model: Model<Child>,
  ) {}

  async create(input: CreateChildInput): Promise<Child> {
    const created = new this.model(input);
    return created.save();
  }

  async createBatch(inputs: CreateChildInput[]): Promise<Child[]> {
    return this.model.insertMany(inputs) as any;
  }

  async update(input: UpdateChildInput): Promise<Child> {
    const { id, ...data } = input;
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async findByParent(parentId: string): Promise<Child[]> {
    return this.model.find({ parentId }).exec();
  }

  async delete(id: string): Promise<Child> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async deleteByParent(parentId: string): Promise<void> {
    await this.model.deleteMany({ parentId }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disciple } from './schemas/disciple.schema';
import { UpdateDiscipleInput } from './dto/update-disciple.input';
import { CreateDiscipleInput } from './dto/create-disciple.input';

@Injectable()
export class DisciplesService {
  constructor(
    @InjectModel(Disciple.name) private discipleModel: Model<Disciple>,
  ) {}

  async create(createUserInput: CreateDiscipleInput): Promise<Disciple> {
    const createdUser = new this.discipleModel(createUserInput);
    return createdUser.save();
  }

  async findAll(): Promise<Disciple[]> {
    return this.discipleModel.find().exec();
  }

  async findOne(id: string): Promise<Disciple> {
    return this.discipleModel.findById(id).exec();
  }

  update(id: number, updateDiscipleInput: UpdateDiscipleInput) {
    return `This action updates a #${id} disciple`;
  }

  remove(id: number) {
    return `This action removes a #${id} disciple`;
  }
}

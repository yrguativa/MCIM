import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Disciple } from './schemas/disciple.schema';
import { UpdateDiscipleInput } from './dto/update-disciple.input';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { DiscipleEntity } from './entities/disciple.entity';

@Injectable()
export class DisciplesService {
  constructor(
    @InjectModel(Disciple.name) private discipleModel: Model<Disciple>,
  ) {}

  async create(createUserInput: CreateDiscipleInput): Promise<DiscipleEntity> {
    const createdDisciple = new this.discipleModel(createUserInput);
    const savedDisciple = await createdDisciple.save();
    return this.toModel(savedDisciple);
  }

  async findAll(): Promise<DiscipleEntity[]> {
    const disciples = await this.discipleModel.find().exec();
    return disciples.map((dis) => this.toModel(dis));
  }

  async findOne(id: string): Promise<DiscipleEntity> {
    const user = await this.discipleModel.findById(id).exec();
    return this.toModel(user);
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

  remove(id: number) {
    return `This action removes a #${id} disciple`;
    // async delete(id: string): Promise<UserModel> {
    //   const deletedUser = await this.userModel
    //     .findByIdAndDelete(id)
    //     .lean()
    //     .exec();

    //   if (!deletedUser) {
    //     throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    //   }

    //   return this.toModel(deletedUser);
  }

  private toModel(disciple: Disciple): DiscipleEntity {
    return {
      id: disciple._id.toString(),
      identification: disciple.identification,
      name: disciple.name,
      lastName: disciple.lastName,
      email: disciple.email,
      phone: disciple.phone,
      address: disciple.address,
      birthDate: disciple.birthDate,
      createdUser: disciple.createdUser,
      createdDate: disciple.createdDate,
      updatedUser: disciple.updatedUser,
      updatedDate: disciple.updatedDate,
    };
  }
}

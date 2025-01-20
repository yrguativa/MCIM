import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCellInput } from './dto/create-cell.input';
import { UpdateCellInput } from './dto/update-cell.input';
import { Cell } from './schemas/cell.schema';
import { Model } from 'mongoose';
import { CellEntity } from './entities/cell.entity';

@Injectable()
export class CellsService {
  constructor(@InjectModel(Cell.name) private cellModel: Model<Cell>) {}

  async create(createCellInput: CreateCellInput): Promise<CellEntity> {
    const createdDisciple = new this.cellModel({
      ...createCellInput,
      createdDate: new Date(),
    });
    const savedDisciple = await createdDisciple.save();
    return this.toModel(savedDisciple);
  }

  async findAll(): Promise<CellEntity[]> {
    const disciples = await this.cellModel.find().exec();
    return disciples.map((dis) => this.toModel(dis));
  }

  async findOne(id: string): Promise<CellEntity> {
    const user = await this.cellModel.findById(id).exec();
    return this.toModel(user);
  }

  async update(
    id: string,
    updateCellInput: UpdateCellInput,
  ): Promise<CellEntity> {
    const updatedUser = await this.cellModel
      .findByIdAndUpdate(
        id,
        { $set: updateCellInput },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
    }

    return this.toModel(updatedUser);
  }

  remove(id: string) {
    return `This action removes a #${id} cell`;
  }

  private toModel(cell: Cell): CellEntity {
    return {
      id: cell._id.toString(),
      leader: cell.leader,
      network: cell.network,
      host: cell.host,
      address: cell.address,
      neighborhood: cell.neighborhood,
      createdDate: cell.createdDate,
      createdUser: cell.createdUser,
    };
  }
}

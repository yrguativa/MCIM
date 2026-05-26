import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCellInput } from './dto/create-cell.input';
import { CreateRecordCellInput } from './dto/create-record-cell.input';
import { UpdateCellInput } from './dto/update-cell.input';
import { AddCellAssistantInput } from './dto/add-cell-assistant.input';
import { DeactivateCellAssistantInput } from './dto/deactivate-cell-assistant.input';
import { Cell, CellAssistant } from './schemas/cell.schema';
import { Model } from 'mongoose';
import { CellEntity } from './entities/cell.entity';

@Injectable()
export class CellsService {
  constructor(@InjectModel(Cell.name) private cellModel: Model<Cell>) {}

  async create(createCellInput: CreateCellInput): Promise<CellEntity> {
    const createdCell = new this.cellModel({
      ...createCellInput,
      createdDate: new Date(),
    });
    const savedDisciple = await createdCell.save();
    return this.toModel(savedDisciple);
  }

  async findAll(): Promise<CellEntity[]> {
    const cells = await this.cellModel.find().exec();
    return cells.map((dis) => this.toModel(dis));
  }

  async findOne(id: string): Promise<CellEntity> {
    const cell = await this.cellModel.findById(id).exec();
    return this.toModel(cell);
  }

  async update(
    id: string,
    updateCellInput: UpdateCellInput,
  ): Promise<CellEntity> {
    const updatedCell = await this.cellModel
      .findByIdAndUpdate(
        id,
        { $set: updateCellInput },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();

    if (!updatedCell) {
      throw new NotFoundException(`Disciple with ID ${id} not found`);
    }

    return this.toModel(updatedCell);
  }

  async addRecord(
    cellId: string,
    createRecordCellInput: CreateRecordCellInput,
  ): Promise<CellEntity> {
    const cell = await this.cellModel.findById(cellId).exec();

    if (!cell) {
      throw new NotFoundException(`Cell with ID ${cellId} not found`);
    }

    const record = {
      topic: createRecordCellInput.topic,
      date: createRecordCellInput.date,
      createdUser: createRecordCellInput.createdUser,
      mode: createRecordCellInput.mode,
      location: createRecordCellInput.location || '',
      leader: cell.leader,
      assistants: createRecordCellInput.assistants || [],
    };
    cell.records.push(record as any);
    const saved = await cell.save();
    return this.toModel(saved);
  }

  async addAssistant(
    cellId: string,
    input: AddCellAssistantInput,
  ): Promise<CellEntity> {
    const cell = await this.cellModel.findById(cellId).exec();

    if (!cell) {
      throw new NotFoundException(`Cell with ID ${cellId} not found`);
    }

    const now = new Date();
    const existingIndex = cell.assistants.findIndex(
      (a) => a.disciple === input.disciple,
    );

    if (existingIndex >= 0) {
      cell.assistants[existingIndex].status = 'active';
      cell.assistants[existingIndex].updatedDate = now;
      cell.assistants[existingIndex].updatedUser = input.createdUser;
    } else {
      cell.assistants.push({
        disciple: input.disciple,
        status: 'active',
        createdDate: now,
        createdUser: input.createdUser,
        updatedDate: now,
        updatedUser: input.createdUser,
      } as any);
    }

    const saved = await cell.save();
    return this.toModel(saved);
  }

  async deactivateAssistant(
    cellId: string,
    input: DeactivateCellAssistantInput,
  ): Promise<CellEntity> {
    const cell = await this.cellModel.findById(cellId).exec();

    if (!cell) {
      throw new NotFoundException(`Cell with ID ${cellId} not found`);
    }

    const existingIndex = cell.assistants.findIndex(
      (a) => a.disciple === input.disciple,
    );

    if (existingIndex >= 0) {
      cell.assistants[existingIndex].status = 'inactive';
      cell.assistants[existingIndex].updatedDate = new Date();
      cell.assistants[existingIndex].updatedUser = input.updatedUser;
    }

    const saved = await cell.save();
    return this.toModel(saved);
  }

  remove(id: string) {
    return `This action removes a #${id} cell`;
  }

  private toModel(cell: any): CellEntity {
    return {
      id: cell._id.toString(),
      leader: cell.leader,
      network: cell.network,
      host: cell.host,
      timoteo: cell.timoteo,
      address: cell.address,
      neighborhood: cell.neighborhood,
      day: cell.day,
      time: cell.time,
      yearOpened: cell.yearOpened,
      createdDate: cell.createdDate,
      createdUser: cell.createdUser,
      assistants: (cell.assistants || []).map((a: any) => ({
        disciple: a.disciple,
        status: a.status,
        createdDate: a.createdDate,
        createdUser: a.createdUser,
        updatedDate: a.updatedDate,
        updatedUser: a.updatedUser,
      })),
      records: (cell.records || []).map((record: any) => ({
        topic: record.topic,
        date: record.date,
        createdUser: record.createdUser,
        mode: record.mode || 'presencial',
        location: record.location,
        leader: record.leader,
        assistants: (record.assistants || []).map((assistant: any) => ({
          name: assistant.name,
          disciple: assistant.disciple,
        })),
      })),
    };
  }
}

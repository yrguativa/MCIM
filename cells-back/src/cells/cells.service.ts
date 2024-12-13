import { Injectable } from '@nestjs/common';
import { CreateCellInput } from './dto/create-cell.input';
import { UpdateCellInput } from './dto/update-cell.input';

@Injectable()
export class CellsService {
  create(createCellInput: CreateCellInput) {
    return 'This action adds a new cell';
  }

  findAll() {
    return `This action returns all cells`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cell`;
  }

  update(id: number, updateCellInput: UpdateCellInput) {
    return `This action updates a #${id} cell`;
  }

  remove(id: number) {
    return `This action removes a #${id} cell`;
  }
}

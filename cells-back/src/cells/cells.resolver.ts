import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CellsService } from './cells.service';
import { Cell } from './entities/cell.entity';
import { CreateCellInput } from './dto/create-cell.input';
import { UpdateCellInput } from './dto/update-cell.input';

@Resolver(() => Cell)
export class CellsResolver {
  constructor(private readonly cellsService: CellsService) {}

  @Mutation(() => Cell)
  createCell(@Args('createCellInput') createCellInput: CreateCellInput) {
    return this.cellsService.create(createCellInput);
  }

  @Query(() => [Cell], { name: 'cells', description: 'Get all cells' })
  findAll() {
    return this.cellsService.findAll();
  }

  @Query(() => Cell, { name: 'cell' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cellsService.findOne(id);
  }

  @Mutation(() => Cell)
  updateCell(@Args('updateCellInput') updateCellInput: UpdateCellInput) {
    return this.cellsService.update(updateCellInput.id, updateCellInput);
  }

  @Mutation(() => Cell)
  removeCell(@Args('id', { type: () => Int }) id: number) {
    return this.cellsService.remove(id);
  }
}

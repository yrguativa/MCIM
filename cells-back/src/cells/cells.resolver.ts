import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CellsService } from './cells.service';
import { CellEntity } from './entities/cell.entity';
import { CreateCellInput } from './dto/create-cell.input';
import { UpdateCellInput } from './dto/update-cell.input';

@Resolver(() => CellEntity)
export class CellsResolver {
  constructor(private readonly cellsService: CellsService) {}

  @Mutation(() => CellEntity)
  createCell(@Args('createCellInput') createCellInput: CreateCellInput) {
    return this.cellsService.create(createCellInput);
  }

  @Query(() => [CellEntity], { name: 'cells', description: 'Get all cells' })
  findAll() {
    return this.cellsService.findAll();
  }

  @Query(() => CellEntity, { name: 'cell' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.cellsService.findOne(id);
  }

  @Mutation(() => CellEntity)
  updateCell(@Args('updateCellInput') updateCellInput: UpdateCellInput) {
    return this.cellsService.update(updateCellInput.id, updateCellInput);
  }

  @Mutation(() => CellEntity)
  removeCell(@Args('id', { type: () => String }) id: string) {
    return this.cellsService.remove(id);
  }
}

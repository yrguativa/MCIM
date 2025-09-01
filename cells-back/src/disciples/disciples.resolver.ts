import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DisciplesService } from './disciples.service';
import { DiscipleEntity } from './entities/disciple.entity';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { UpdateDiscipleInput } from './dto/update-disciple.input';
import { Logger } from '@nestjs/common';

@Resolver(() => DiscipleEntity)
export class DisciplesResolver {
  constructor(private readonly disciplesService: DisciplesService) {}

  @Mutation(() => DiscipleEntity)
  createDisciple(
    @Args('createDiscipleInput') createDiscipleInput: CreateDiscipleInput,
  ) {
    return this.disciplesService.create(createDiscipleInput);
  }

  @Query(() => [DiscipleEntity], { name: 'disciples' })
  findAll(): Promise<DiscipleEntity[]> {
    return this.disciplesService.findAll();
  }

  @Query(() => DiscipleEntity, { name: 'disciple' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.disciplesService.findOne(id);
  }

  @Mutation(() => DiscipleEntity)
  updateDisciple(
    @Args('updateDiscipleInput') updateDiscipleInput: UpdateDiscipleInput,
  ) {
    Logger.log(
      '🚀 ~ DisciplesResolver ~ updateDiscipleInput:',
      updateDiscipleInput,
    );
    return this.disciplesService.update(
      updateDiscipleInput.id,
      updateDiscipleInput,
    );
  }

  @Mutation(() => DiscipleEntity)
  removeDisciple(@Args('id', { type: () => String }) id: string) {
    return this.disciplesService.remove(id);
  }

  @Query(() => [DiscipleEntity], { name: 'discipleByName' })
  searchDisciplesByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<DiscipleEntity[]> {
    return this.disciplesService.searchByName(name);
  }

  @Query(() => DiscipleEntity, { name: 'discipleByIdentification' })
  findOneByIdentification(
    @Args('identification', { type: () => String }) identification: string,
  ) {
    return this.disciplesService.searchByIdentification(identification);
  }
}

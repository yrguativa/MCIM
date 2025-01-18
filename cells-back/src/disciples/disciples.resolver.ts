import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DisciplesService } from './disciples.service';
import { DiscipleEntity } from './entities/disciple.entity';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { UpdateDiscipleInput } from './dto/update-disciple.input';

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
    return this.disciplesService.update(
      updateDiscipleInput.id,
      updateDiscipleInput,
    );
  }

  // @Mutation(() => Disciple)
  // removeDisciple(@Args('id', { type: () => Int }) id: number) {
  //   return this.disciplesService.remove(id);
  // }
}

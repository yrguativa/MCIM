import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DisciplesService } from './disciples.service';
import { Disciple } from './entities/disciple.entity';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { UpdateDiscipleInput } from './dto/update-disciple.input';

@Resolver(() => Disciple)
export class DisciplesResolver {
  constructor(private readonly disciplesService: DisciplesService) {}

  @Mutation(() => Disciple)
  createDisciple(
    @Args('createDiscipleInput') createDiscipleInput: CreateDiscipleInput,
  ) {
    return this.disciplesService.create(createDiscipleInput);
  }

  @Query(() => [Disciple], { name: 'disciples' })
  findAll(): Promise<Disciple[]> {
    return this.disciplesService.findAll();
  }

  @Query(() => Disciple, { name: 'disciple' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.disciplesService.findOne(id);
  }

  // @Mutation(() => Disciple)
  // updateDisciple(@Args('updateDiscipleInput') updateDiscipleInput: UpdateDiscipleInput) {
  //   return this.disciplesService.update(updateDiscipleInput.id, updateDiscipleInput);
  // }

  // @Mutation(() => Disciple)
  // removeDisciple(@Args('id', { type: () => Int }) id: number) {
  //   return this.disciplesService.remove(id);
  // }
}

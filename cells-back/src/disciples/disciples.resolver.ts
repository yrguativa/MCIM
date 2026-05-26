import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DisciplesService } from './disciples.service';
import { DiscipleEntity } from './entities/disciple.entity';
import { DiscipleFullEntity } from './entities/disciple-full.entity';
import { DisciplePersonalInfoEntity } from './entities/disciple-personal-info.entity';
import { LeaderEntity } from './entities/leader.entity';
import { CreateDiscipleInput } from './dto/create-disciple.input';
import { UpdateDiscipleInput } from './dto/update-disciple.input';
import { CreateDisciplePersonalInfoInput } from './dto/create-disciple-personal-info.input';
import { UpdateDisciplePersonalInfoInput } from './dto/update-disciple-personal-info.input';
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

  @Mutation(() => DiscipleEntity)
  createDiscipleFull(
    @Args('createDiscipleInput') createDiscipleInput: CreateDiscipleInput,
    @Args('createPersonalInfoInput')
    createPersonalInfoInput: CreateDisciplePersonalInfoInput,
  ) {
    return this.disciplesService.createFull(
      createDiscipleInput,
      createPersonalInfoInput,
    );
  }

  @Query(() => [DiscipleEntity], { name: 'disciples' })
  findAll(): Promise<DiscipleEntity[]> {
    return this.disciplesService.findAll();
  }

  @Query(() => DiscipleEntity, { name: 'disciple' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.disciplesService.findOne(id);
  }

  @Query(() => DiscipleFullEntity, {
    nullable: true,
    name: 'discipleByIdentification',
  })
  async findByIdentification(
    @Args('identification', { type: () => String }) identification: string,
  ) {
    return this.disciplesService.findByIdentification(identification);
  }

  @Query(() => [LeaderEntity], { name: 'discipleLeaders' })
  async discipleLeaders() {
    return this.disciplesService.findLeaders();
  }

  @Query(() => DisciplePersonalInfoEntity, {
    nullable: true,
    name: 'disciplePersonalInfo',
  })
  async findPersonalInfo(
    @Args('discipleId', { type: () => String }) discipleId: string,
  ) {
    return this.disciplesService.findPersonalInfo(discipleId);
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
  updateDiscipleFull(
    @Args('updateDiscipleInput') updateDiscipleInput: UpdateDiscipleInput,
    @Args('updatePersonalInfoInput', { nullable: true })
    updatePersonalInfoInput: UpdateDisciplePersonalInfoInput,
  ) {
    return this.disciplesService.updateFull(
      updateDiscipleInput.id,
      updateDiscipleInput,
      updatePersonalInfoInput,
    );
  }

  @Mutation(() => DiscipleEntity)
  removeDisciple(@Args('id', { type: () => String }) id: string) {
    return this.disciplesService.remove(id);
  }

  @Query(() => DiscipleFullEntity, {
    nullable: true,
    name: 'discipleByEmail',
  })
  async findByEmail(@Args('email', { type: () => String }) email: string) {
    return this.disciplesService.findByEmail(email);
  }

  @Query(() => [DiscipleEntity], { name: 'discipleByName' })
  searchDisciplesByName(
    @Args('name', { type: () => String }) name: string,
  ): Promise<DiscipleEntity[]> {
    return this.disciplesService.searchByName(name);
  }
}

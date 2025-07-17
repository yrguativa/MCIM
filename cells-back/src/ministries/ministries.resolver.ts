import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MinistriesService } from './ministries.service';
import { MinistryEntity } from './entities/ministry.entity';
import { CreateMinistryInput, UpdateMinistryInput } from './dto/ministry.input';
import { Logger } from '@nestjs/common';

@Resolver(() => MinistryEntity)
export class MinistriesResolver {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Query(() => [MinistryEntity])
  async ministries(): Promise<MinistryEntity[]> {
    return this.ministriesService.findAll();
  }

  @Query(() => MinistryEntity)
  async ministry(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<MinistryEntity> {
    return this.ministriesService.findOne(id);
  }

  @Query(() => [MinistryEntity])
  async subMinistries(
    @Args('ministryId', { type: () => ID }) ministryId: string,
  ): Promise<MinistryEntity[]> {
    return this.ministriesService.findSubMinistries(ministryId);
  }

  @Mutation(() => MinistryEntity)
  async createMinistry(
    @Args('ministry') createMinistryInput: CreateMinistryInput,
  ): Promise<MinistryEntity> {
    Logger.log(
      '🚀 ~ MinistriesResolver ~ createMinistry:',
      createMinistryInput,
    );
    return this.ministriesService.create(createMinistryInput);
  }

  @Mutation(() => MinistryEntity)
  async updateMinistry(
    @Args('ministry') updateMinistryInput: UpdateMinistryInput,
  ): Promise<MinistryEntity> {
    return this.ministriesService.update(
      updateMinistryInput.id,
      updateMinistryInput,
    );
  }

  @Mutation(() => Boolean)
  async deleteMinistry(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    const ministry = await this.ministriesService.remove(id);
    return !!ministry;
  }
}

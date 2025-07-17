import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MinistriesService } from './ministries.service';
import { Ministry } from './entities/ministry.entity';
import { CreateMinistryInput, UpdateMinistryInput } from './dto/ministry.input';

@Resolver(() => Ministry)
export class MinistriesResolver {
  constructor(private readonly ministriesService: MinistriesService) {}

  @Query(() => [Ministry])
  async ministries(): Promise<Ministry[]> {
    return this.ministriesService.findAll();
  }

  @Query(() => Ministry)
  async ministry(@Args('id', { type: () => ID }) id: string): Promise<Ministry> {
    return this.ministriesService.findOne(id);
  }

  @Query(() => [Ministry])
  async subMinistries(
    @Args('ministryId', { type: () => ID }) ministryId: string,
  ): Promise<Ministry[]> {
    return this.ministriesService.findSubMinistries(ministryId);
  }

  @Mutation(() => Ministry)
  async createMinistry(
    @Args('ministry') createMinistryInput: CreateMinistryInput,
  ): Promise<Ministry> {
    return this.ministriesService.create(createMinistryInput);
  }

  @Mutation(() => Ministry)
  async updateMinistry(
    @Args('ministry') updateMinistryInput: UpdateMinistryInput,
  ): Promise<Ministry> {
    return this.ministriesService.update(updateMinistryInput.id, updateMinistryInput);
  }

  @Mutation(() => Boolean)
  async deleteMinistry(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.ministriesService.remove(id);
  }
}

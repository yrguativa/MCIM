import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NeighborhoodService } from '../services/neighborhood.service';
import { NeighborhoodEntity } from '../entities/neighborhood.entity';
import { CreateNeighborhoodInput } from '../dto/create-neighborhood.input';

@Resolver(() => NeighborhoodEntity)
export class NeighborhoodResolver {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}

  @Query(() => [NeighborhoodEntity], { name: 'neighborhoods' })
  async findAll() {
    return this.neighborhoodService.findAll();
  }

  @Query(() => NeighborhoodEntity, { name: 'neighborhood' })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.neighborhoodService.findOne(id);
  }

  @Mutation(() => NeighborhoodEntity)
  async createNeighborhood(
    @Args('name') name: string,
  ) {
    return this.neighborhoodService.create({ name });
  }
}

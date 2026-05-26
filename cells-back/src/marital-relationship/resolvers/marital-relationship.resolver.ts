import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MaritalRelationshipService } from '../services/marital-relationship.service';
import { MaritalRelationshipEntity } from '../entities/marital-relationship.entity';
import { CreateMaritalRelationshipInput } from '../dto/create-marital-relationship.input';
import { UpdateMaritalRelationshipInput } from '../dto/update-marital-relationship.input';

@Resolver(() => MaritalRelationshipEntity)
export class MaritalRelationshipResolver {
  constructor(
    private readonly service: MaritalRelationshipService,
  ) {}

  @Mutation(() => MaritalRelationshipEntity)
  createMaritalRelationship(
    @Args('input') input: CreateMaritalRelationshipInput,
  ) {
    return this.service.create(input);
  }

  @Mutation(() => MaritalRelationshipEntity)
  updateMaritalRelationship(
    @Args('input') input: UpdateMaritalRelationshipInput,
  ) {
    return this.service.update(input);
  }

  @Query(() => MaritalRelationshipEntity, { nullable: true })
  maritalRelationshipByDisciple(
    @Args('discipleId', { type: () => String }) discipleId: string,
  ) {
    return this.service.findByDisciple(discipleId);
  }

  @Mutation(() => MaritalRelationshipEntity)
  deleteMaritalRelationship(
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.service.delete(id);
  }
}

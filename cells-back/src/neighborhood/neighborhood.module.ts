import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Neighborhood, NeighborhoodSchema } from './schemas/neighborhood.schema';
import { NeighborhoodService } from './services/neighborhood.service';
import { NeighborhoodResolver } from './resolvers/neighborhood.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Neighborhood.name, schema: NeighborhoodSchema }]),
  ],
  providers: [NeighborhoodResolver, NeighborhoodService],
  exports: [NeighborhoodService],
})
export class NeighborhoodModule {}

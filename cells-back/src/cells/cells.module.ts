import { Module } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CellsResolver } from './cells.resolver';

@Module({
  providers: [CellsResolver, CellsService],
})
export class CellsModule {}

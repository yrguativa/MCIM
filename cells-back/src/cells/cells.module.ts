import { Module } from '@nestjs/common';
import { CellsService } from './cells.service';
import { CellsResolver } from './cells.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Cell, CellSchema } from './schemas/cell.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cell.name, schema: CellSchema }]),
  ],
  providers: [CellsResolver, CellsService],
})
export class CellsModule {}

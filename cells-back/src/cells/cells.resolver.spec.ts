import { Test, TestingModule } from '@nestjs/testing';
import { CellsResolver } from './cells.resolver';
import { CellsService } from './cells.service';

describe('CellsResolver', () => {
  let resolver: CellsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CellsResolver, CellsService],
    }).compile();

    resolver = module.get<CellsResolver>(CellsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

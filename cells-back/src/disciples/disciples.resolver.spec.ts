import { Test, TestingModule } from '@nestjs/testing';
import { DisciplesResolver } from './disciples.resolver';
import { DisciplesService } from './disciples.service';

describe('DisciplesResolver', () => {
  let resolver: DisciplesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisciplesResolver, DisciplesService],
    }).compile();

    resolver = module.get<DisciplesResolver>(DisciplesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { DisciplesService } from './disciples.service';

describe('DisciplesService', () => {
  let service: DisciplesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisciplesService],
    }).compile();

    service = module.get<DisciplesService>(DisciplesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

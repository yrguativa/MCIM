import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DisciplesResolver } from './disciples.resolver';
import { DisciplesService } from './disciples.service';
import { Disciple } from './schemas/disciple.schema';
import { DisciplePersonalInfo } from './schemas/disciple-personal-info.schema';

describe('DisciplesResolver', () => {
  let resolver: DisciplesResolver;

  const mockDiscipleModel = {
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    findByIdAndDelete: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    deleteMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
  };

  const mockPersonalInfoModel = {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ lean: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) }),
    deleteMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplesResolver,
        DisciplesService,
        { provide: getModelToken(Disciple.name), useValue: mockDiscipleModel },
        { provide: getModelToken(DisciplePersonalInfo.name), useValue: mockPersonalInfoModel },
      ],
    }).compile();

    resolver = module.get<DisciplesResolver>(DisciplesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

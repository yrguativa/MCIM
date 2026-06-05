import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CellsService } from './cells.service';
import { Cell } from './schemas/cell.schema';

describe('CellsService', () => {
  let service: CellsService;

  const mockCellData = {
    _id: 'cell-1',
    leader: 'leader-1',
    network: 1,
    host: 'host-1',
    timoteo: 'timoteo-1',
    address: 'Calle 123',
    neighborhood: 1,
    day: 'Lunes',
    time: '18:00',
    createdDate: new Date(),
    createdUser: 'user-1',
    assistants: [],
    records: [],
  };

  const mockSave = jest.fn().mockResolvedValue(mockCellData);
  const mockCellInstance = {
    ...mockCellData,
    save: mockSave,
  };

  const createMockModel = () => {
    const model: any = jest.fn().mockImplementation(() => mockCellInstance);
    model.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCellData]),
    });
    model.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCellData),
    });
    model.findByIdAndUpdate = jest.fn().mockReturnValue({
      lean: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCellData),
      }),
    });
    return model;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CellsService,
        {
          provide: getModelToken(Cell.name),
          useValue: createMockModel(),
        },
      ],
    }).compile();

    service = module.get<CellsService>(CellsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a cell with all fields', async () => {
      const createCellInput = {
        leader: 'leader-1',
        network: 1,
        cellType: 'presencial',
        host: 'host-1',
        timoteo: 'timoteo-1',
        address: 'Calle 123',
        neighborhood: 'neighborhood-1',
        day: 'Lunes',
        time: '18:00',
        createdUser: 'user-1',
      };

      const result = await service.create(createCellInput);

      expect(result.leader).toEqual('leader-1');
      expect(result.host).toEqual('host-1');
      expect(result.timoteo).toEqual('timoteo-1');
      expect(result.day).toEqual('Lunes');
      expect(result.time).toEqual('18:00');
    });
  });

  describe('findAll', () => {
    it('should return all cells', async () => {
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].timoteo).toEqual('timoteo-1');
      expect(result[0].day).toEqual('Lunes');
    });
  });

  describe('addRecord', () => {
    it('should add a record with assistants to a cell', async () => {
      const mockCellWithRecords = {
        ...mockCellData,
        records: [],
        save: jest.fn().mockResolvedValue({
          ...mockCellData,
          records: [
            {
              topic: 'Test Topic',
              date: new Date(),
              createdUser: 'user-1',
              assistants: [{ name: 'Juan', disciple: 'disciple-1' }],
            },
          ],
        }),
      };

      const recordModel: any = jest
        .fn()
        .mockImplementation(() => mockCellWithRecords);
      recordModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCellWithRecords),
      });

      const moduleWithRecord: TestingModule = await Test.createTestingModule({
        providers: [
          CellsService,
          {
            provide: getModelToken(Cell.name),
            useValue: recordModel,
          },
        ],
      }).compile();

      const serviceWithRecord =
        moduleWithRecord.get<CellsService>(CellsService);

      const recordInput = {
        topic: 'Test Topic',
        date: new Date(),
        mode: 'presencial',
        createdUser: 'user-1',
        assistants: [{ name: 'Juan', disciple: 'disciple-1' }],
      };

      const result = await serviceWithRecord.addRecord('cell-1', recordInput);
      expect(result.records).toHaveLength(1);
      expect(result.records[0].assistants[0].name).toEqual('Juan');
    });
  });

  describe('addAssistant', () => {
    it('should add a new assistant to a cell', async () => {
      const cellWithAssistants = {
        ...mockCellData,
        assistants: [
          {
            disciple: 'disciple-1',
            status: 'active',
            createdDate: new Date(),
            createdUser: 'user-1',
            updatedDate: new Date(),
            updatedUser: 'user-1',
          },
        ],
        save: jest.fn().mockResolvedValue({
          ...mockCellData,
          assistants: [
            {
              disciple: 'disciple-1',
              status: 'active',
              createdDate: new Date(),
              createdUser: 'user-1',
              updatedDate: new Date(),
              updatedUser: 'user-1',
            },
          ],
        }),
      };

      const model: any = jest.fn().mockImplementation(() => cellWithAssistants);
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(cellWithAssistants),
      });

      const moduleWithAssistant: TestingModule = await Test.createTestingModule(
        {
          providers: [
            CellsService,
            {
              provide: getModelToken(Cell.name),
              useValue: model,
            },
          ],
        },
      ).compile();

      const serviceWithAssistant =
        moduleWithAssistant.get<CellsService>(CellsService);

      const result = await serviceWithAssistant.addAssistant('cell-1', {
        disciple: 'disciple-1',
        createdUser: 'user-1',
      });

      expect(result.assistants).toHaveLength(1);
      expect(result.assistants[0].disciple).toEqual('disciple-1');
      expect(result.assistants[0].status).toEqual('active');
    });
  });

  describe('deactivateAssistant', () => {
    it('should deactivate an assistant', async () => {
      const cellWithActive = {
        ...mockCellData,
        assistants: [
          {
            disciple: 'disciple-1',
            status: 'active',
            createdDate: new Date(),
            createdUser: 'user-1',
            updatedDate: new Date(),
            updatedUser: 'user-1',
          },
        ],
        save: jest.fn().mockResolvedValue({
          ...mockCellData,
          assistants: [
            {
              disciple: 'disciple-1',
              status: 'inactive',
              createdDate: new Date(),
              createdUser: 'user-1',
              updatedDate: new Date(),
              updatedUser: 'user-2',
            },
          ],
        }),
      };

      const model: any = jest.fn().mockImplementation(() => cellWithActive);
      model.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(cellWithActive),
      });

      const moduleWithDeactivate: TestingModule =
        await Test.createTestingModule({
          providers: [
            CellsService,
            {
              provide: getModelToken(Cell.name),
              useValue: model,
            },
          ],
        }).compile();

      const serviceWithDeactivate =
        moduleWithDeactivate.get<CellsService>(CellsService);

      const result = await serviceWithDeactivate.deactivateAssistant('cell-1', {
        disciple: 'disciple-1',
        updatedUser: 'user-2',
      });

      expect(result.assistants[0].status).toEqual('inactive');
    });
  });
});

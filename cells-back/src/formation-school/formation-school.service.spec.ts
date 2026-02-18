import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormationSchoolService } from './formation-school.service';
import { Cycle } from './schemas/cycle.schema';
import { Level } from './schemas/level.schema';
import { Classroom } from './schemas/classroom.schema';
import { Schedule } from './schemas/schedule.schema';
import { CourseClass } from './schemas/course-class.schema';
import { StudentEnrollment } from './schemas/student-enrollment.schema';
import { Attendance } from './schemas/attendance.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FormationSchoolService', () => {
  let service: FormationSchoolService;
  let cycleModel: any;
  let levelModel: any;
  let classroomModel: any;
  let scheduleModel: any;
  let courseClassModel: any;
  let enrollmentModel: any;
  let attendanceModel: any;

  const mockCycle = {
    _id: 'cycle-1',
    name: 'Ciclo 2026-1',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    requiredClasses: 8,
    active: true,
    createdUser: 'user-1',
    createdDate: new Date(),
    save: jest.fn().mockResolvedValue(true),
  };

  const mockClassroom = {
    _id: 'classroom-1',
    name: 'Salón 1',
    capacity: 20,
    location: 'Edificio Principal',
    createdUser: 'user-1',
    createdDate: new Date(),
    save: jest.fn().mockResolvedValue(true),
  };

  const mockSchedule = {
    _id: 'schedule-1',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    createdUser: 'user-1',
    createdDate: new Date(),
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const mockCycleModel = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockCycle]),
        }),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCycle),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
    };

    const mockLevelModel = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    };

    const mockClassroomModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockClassroom]),
      }),
    };

    const mockScheduleModel = {
      find: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockSchedule]),
      }),
    };

    const mockCourseClassModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({ qrCode: 'data:image/png;base64,...', qrExpiration: new Date() }),
      }),
    };

    const mockEnrollmentModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
      findById: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      }),
    };

    const mockAttendanceModel = {
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
      countDocuments: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(5),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormationSchoolService,
        { provide: getModelToken(Cycle.name), useValue: mockCycleModel },
        { provide: getModelToken(Level.name), useValue: mockLevelModel },
        { provide: getModelToken(Classroom.name), useValue: mockClassroomModel },
        { provide: getModelToken(Schedule.name), useValue: mockScheduleModel },
        { provide: getModelToken(CourseClass.name), useValue: mockCourseClassModel },
        { provide: getModelToken(StudentEnrollment.name), useValue: mockEnrollmentModel },
        { provide: getModelToken(Attendance.name), useValue: mockAttendanceModel },
      ],
    }).compile();

    service = module.get<FormationSchoolService>(FormationSchoolService);
    cycleModel = module.get(getModelToken(Cycle.name));
    classroomModel = module.get(getModelToken(Classroom.name));
    scheduleModel = module.get(getModelToken(Schedule.name));
    courseClassModel = module.get(getModelToken(CourseClass.name));
    enrollmentModel = module.get(getModelToken(StudentEnrollment.name));
    attendanceModel = module.get(getModelToken(Attendance.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Cycles', () => {
    it('should create a new cycle', async () => {
      const createCycleInput = {
        name: 'Ciclo 2026-1',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        requiredClasses: 8,
        active: true,
        createdUser: 'user-1',
      };

      const result = await service.createCycle(createCycleInput);
      expect(result).toBeDefined();
    });

    it('should return all cycles', async () => {
      const result = await service.findAllCycles();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should find active cycle', async () => {
      const result = await service.findActiveCycle();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when cycle not found', async () => {
      jest.spyOn(cycleModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findCycleById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Classrooms', () => {
    it('should create a new classroom', async () => {
      const createClassroomInput = {
        name: 'Salón 2',
        capacity: 15,
        location: 'Edificio Secundario',
        createdUser: 'user-1',
      };

      const result = await service.createClassroom(createClassroomInput);
      expect(result).toBeDefined();
    });

    it('should return all classrooms', async () => {
      const result = await service.findAllClassrooms();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Schedules', () => {
    it('should create a new schedule', async () => {
      const createScheduleInput = {
        dayOfWeek: 2,
        startTime: '10:00',
        endTime: '12:00',
        createdUser: 'user-1',
      };

      const result = await service.createSchedule(createScheduleInput);
      expect(result).toBeDefined();
    });

    it('should return all schedules', async () => {
      const result = await service.findAllSchedules();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Course Classes', () => {
    it('should check schedule conflict - no conflict', async () => {
      jest.spyOn(courseClassModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.checkScheduleConflict('classroom-1', 'schedule-1');
      expect(result).toBe(false);
    });

    it('should check schedule conflict - conflict exists', async () => {
      jest.spyOn(courseClassModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-class' }),
      });

      const result = await service.checkScheduleConflict('classroom-1', 'schedule-1');
      expect(result).toBe(true);
    });

    it('should throw BadRequestException on schedule conflict', async () => {
      jest.spyOn(courseClassModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-class' }),
      });

      const createCourseClassInput = {
        levelId: 'level-1',
        teacherId: 'teacher-1',
        classroomId: 'classroom-1',
        scheduleId: 'schedule-1',
        cycleId: 'cycle-1',
        createdUser: 'user-1',
      };

      await expect(service.createCourseClass(createCourseClassInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Attendance and Grades', () => {
    it('should calculate final grade', async () => {
      const enrollmentId = 'enrollment-1';
      const requiredClasses = 8;

      const result = await service.calculateFinalGrade(enrollmentId, requiredClasses);
      
      expect(typeof result).toBe('number');
      expect(result).toBe(62.5); // 5/8 * 100
    });

    it('should create attendance', async () => {
      const createAttendanceInput = {
        studentEnrollmentId: 'enrollment-1',
        courseId: 'course-class-1',
        attended: true,
        attendanceDate: new Date(),
        createdUser: 'user-1',
      };

      const result = await service.createAttendance(createAttendanceInput);
      expect(result).toBeDefined();
    });
  });
});

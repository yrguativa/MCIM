import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FormationSchoolService } from './formation-school.service';
import { Cycle } from './schemas/cycle.schema';
import { Level } from './schemas/level.schema';
import { Classroom } from './schemas/classroom.schema';
import { Schedule } from './schemas/schedule.schema';
import { Course } from './schemas/course.schema';
import { Student } from './schemas/student.schema';
import { StudentEnrollment } from './schemas/student-enrollment.schema';
import { TeacherAssignment } from './schemas/teacher-assignment.schema';
import { Attendance } from './schemas/attendance.schema';
import { StudentCourseHistory } from './schemas/student-course-history.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FormationSchoolService', () => {
  let service: FormationSchoolService;
  let cycleModel: any;
  let levelModel: any;
  let classroomModel: any;
  let scheduleModel: any;
  let courseModel: any;
  let enrollmentModel: any;
  let attendanceModel: any;

  const mockCycleData = {
    _id: 'cycle-1',
    name: 'Ciclo 2026-1',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
    requiredClasses: 8,
    active: true,
    createdUser: 'user-1',
    createdDate: new Date(),
  };

  const mockClassroomData = {
    _id: 'classroom-1',
    name: 'Salón 1',
    capacity: 20,
    location: 'Edificio Principal',
    createdUser: 'user-1',
    createdDate: new Date(),
  };

  const mockScheduleData = {
    _id: 'schedule-1',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    levelId: 'level-1',
    createdUser: 'user-1',
    createdDate: new Date(),
  };

  const mockEntityFields = {
    _id: 'new-id',
    toString: () => 'new-id',
  };

  beforeEach(async () => {
    const mockCycleSave = jest.fn().mockResolvedValue(mockCycleData);
    const mockCycleModel: any = jest.fn().mockImplementation(() => ({
      ...mockCycleData,
      save: mockCycleSave,
    }));
    mockCycleModel.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCycleData]),
      }),
    });
    mockCycleModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCycleData),
    });
    mockCycleModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const mockLevelModel = {
      find: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([]),
        }),
      }),
    };

    const mockClassroomSave = jest.fn().mockResolvedValue(mockClassroomData);
    const mockClassroomModel: any = jest.fn().mockImplementation(() => ({
      ...mockClassroomData,
      save: mockClassroomSave,
    }));
    mockClassroomModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockClassroomData]),
    });

    const mockScheduleSave = jest.fn().mockResolvedValue(mockScheduleData);
    const mockScheduleModel: any = jest.fn().mockImplementation(() => ({
      ...mockScheduleData,
      save: mockScheduleSave,
    }));
    mockScheduleModel.find = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockScheduleData]),
    });

    const mockCourseSave = jest.fn().mockResolvedValue({
      _id: 'course-1',
      levelId: 'level-1',
      teacherId: 'teacher-1',
      classroomId: 'classroom-1',
      scheduleId: 'schedule-1',
      cycleId: 'cycle-1',
      createdUser: 'user-1',
      createdDate: new Date(),
    });
    const mockCourseModel: any = jest.fn().mockImplementation(() => ({
      save: mockCourseSave,
    }));
    mockCourseModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });
    mockCourseModel.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockCourseModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockCourseModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: 'course-1',
        qrCode: 'data:image/png;base64,...',
        qrExpiration: new Date(),
        levelId: 'level-1',
        teacherId: 'teacher-1',
        classroomId: 'classroom-1',
        scheduleId: 'schedule-1',
        cycleId: 'cycle-1',
        createdUser: 'user-1',
        createdDate: new Date(),
      }),
    });

    const mockEnrollmentSave = jest.fn().mockResolvedValue({
      ...mockEntityFields,
      studentId: 'student-1',
      courseId: 'course-1',
      enrollmentDate: new Date(),
      status: 'active',
      createdUser: 'user-1',
      createdDate: new Date(),
    });
    const mockEnrollmentModel: any = jest.fn().mockImplementation(() => ({
      save: mockEnrollmentSave,
    }));
    mockEnrollmentModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });
    mockEnrollmentModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    mockEnrollmentModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        ...mockEntityFields,
        studentId: 'student-1',
        courseId: 'course-1',
        finalGrade: 62.5,
      }),
    });

    const mockAttendanceSave = jest.fn().mockResolvedValue({
      ...mockEntityFields,
      studentEnrollmentId: 'enrollment-1',
      courseId: 'course-1',
      attended: true,
      attendanceDate: new Date(),
      createdUser: 'user-1',
      createdDate: new Date(),
    });
    const mockAttendanceModel: any = jest.fn().mockImplementation(() => ({
      save: mockAttendanceSave,
    }));
    mockAttendanceModel.find = jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      }),
    });
    mockAttendanceModel.countDocuments = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(5),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormationSchoolService,
        { provide: getModelToken(Cycle.name), useValue: mockCycleModel },
        { provide: getModelToken(Level.name), useValue: mockLevelModel },
        {
          provide: getModelToken(Classroom.name),
          useValue: mockClassroomModel,
        },
        { provide: getModelToken(Schedule.name), useValue: mockScheduleModel },
        {
          provide: getModelToken(Course.name),
          useValue: mockCourseModel,
        },
        {
          provide: getModelToken(StudentEnrollment.name),
          useValue: mockEnrollmentModel,
        },
        {
          provide: getModelToken(Attendance.name),
          useValue: mockAttendanceModel,
        },
        {
          provide: getModelToken(Student.name),
          useValue: { find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) },
        },
        {
          provide: getModelToken(TeacherAssignment.name),
          useValue: { find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) },
        },
        {
          provide: getModelToken(StudentCourseHistory.name),
          useValue: { find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) },
        },
      ],
    }).compile();

    service = module.get<FormationSchoolService>(FormationSchoolService);
    cycleModel = module.get(getModelToken(Cycle.name));
    classroomModel = module.get(getModelToken(Classroom.name));
    scheduleModel = module.get(getModelToken(Schedule.name));
    courseModel = module.get(getModelToken(Course.name));
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

      await expect(service.findCycleById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
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
        levelId: 'level-1',
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
      jest.spyOn(courseModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.checkScheduleConflict(
        'classroom-1',
        'schedule-1',
      );
      expect(result).toBe(false);
    });

    it('should check schedule conflict - conflict exists', async () => {
      jest.spyOn(courseModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-class' }),
      });

      const result = await service.checkScheduleConflict(
        'classroom-1',
        'schedule-1',
      );
      expect(result).toBe(true);
    });

    it('should throw BadRequestException on schedule conflict', async () => {
      jest.spyOn(courseModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: 'existing-class' }),
      });

      const createCourseInput = {
        levelId: 'level-1',
        teacherId: 'teacher-1',
        classroomId: 'classroom-1',
        scheduleId: 'schedule-1',
        cycleId: 'cycle-1',
        createdUser: 'user-1',
      };

      await expect(
        service.createCourse(createCourseInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Attendance and Grades', () => {
    it('should calculate final grade', async () => {
      const enrollmentId = 'enrollment-1';
      const requiredClasses = 8;

      const result = await service.calculateFinalGrade(
        enrollmentId,
        requiredClasses,
      );

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

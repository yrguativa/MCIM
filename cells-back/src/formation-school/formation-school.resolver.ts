import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { FormationSchoolService } from './formation-school.service';
import { CycleEntity } from './entities/cycle.entity';
import { LevelEntity } from './entities/level.entity';
import { ClassroomEntity } from './entities/classroom.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { CourseClassEntity } from './entities/course-class.entity';
import { StudentEnrollmentEntity } from './entities/student-enrollment.entity';
import { AttendanceEntity } from './entities/attendance.entity';
import { CreateCycleInput } from './dto/create-cycle.input';
import { CreateLevelInput } from './dto/create-level.input';
import { CreateClassroomInput } from './dto/create-classroom.input';
import { CreateScheduleInput } from './dto/create-schedule.input';
import { CreateCourseClassInput } from './dto/create-course-class.input';
import { EnrollStudentInput, UpdateEnrollmentInput } from './dto/enroll-student.input';
import { CreateAttendanceInput } from './dto/create-attendance.input';

@Resolver()
export class FormationSchoolResolver {
  constructor(private readonly fsService: FormationSchoolService) {}

  @Query(() => [CycleEntity])
  async cycles(): Promise<CycleEntity[]> {
    return this.fsService.findAllCycles();
  }

  @Query(() => CycleEntity)
  async cycle(@Args('id', { type: () => ID }) id: string): Promise<CycleEntity> {
    return this.fsService.findCycleById(id);
  }

  @Query(() => CycleEntity)
  async activeCycle(): Promise<CycleEntity> {
    return this.fsService.findActiveCycle();
  }

  @Mutation(() => CycleEntity)
  async createCycle(@Args('input') input: CreateCycleInput): Promise<CycleEntity> {
    return this.fsService.createCycle(input);
  }

  @Query(() => [LevelEntity])
  async levelsByCycle(@Args('cycleId', { type: () => ID }) cycleId: string): Promise<LevelEntity[]> {
    return this.fsService.findLevelsByCycle(cycleId);
  }

  @Mutation(() => LevelEntity)
  async createLevel(@Args('input') input: CreateLevelInput): Promise<LevelEntity> {
    return this.fsService.createLevel(input);
  }

  @Query(() => [ClassroomEntity])
  async classrooms(): Promise<ClassroomEntity[]> {
    return this.fsService.findAllClassrooms();
  }

  @Mutation(() => ClassroomEntity)
  async createClassroom(@Args('input') input: CreateClassroomInput): Promise<ClassroomEntity> {
    return this.fsService.createClassroom(input);
  }

  @Query(() => [ScheduleEntity])
  async schedules(): Promise<ScheduleEntity[]> {
    return this.fsService.findAllSchedules();
  }

  @Mutation(() => ScheduleEntity)
  async createSchedule(@Args('input') input: CreateScheduleInput): Promise<ScheduleEntity> {
    return this.fsService.createSchedule(input);
  }

  @Query(() => [CourseClassEntity])
  async courseClassesByCycle(@Args('cycleId', { type: () => ID }) cycleId: string): Promise<CourseClassEntity[]> {
    return this.fsService.findCourseClassesByCycle(cycleId);
  }

  @Query(() => [CourseClassEntity])
  async courseClassesByTeacher(@Args('teacherId', { type: () => ID }) teacherId: string): Promise<CourseClassEntity[]> {
    return this.fsService.findCourseClassesByTeacher(teacherId);
  }

  @Mutation(() => CourseClassEntity)
  async createCourseClass(@Args('input') input: CreateCourseClassInput): Promise<CourseClassEntity> {
    return this.fsService.createCourseClass(input);
  }

  @Mutation(() => CourseClassEntity)
  async generateQRCode(@Args('courseClassId', { type: () => ID }) courseClassId: string): Promise<CourseClassEntity> {
    return this.fsService.generateQRCode(courseClassId);
  }

  @Query(() => [StudentEnrollmentEntity])
  async enrollmentsByCourseClass(@Args('courseClassId', { type: () => ID }) courseClassId: string): Promise<StudentEnrollmentEntity[]> {
    return this.fsService.findEnrollmentsByCourseClass(courseClassId);
  }

  @Query(() => [StudentEnrollmentEntity])
  async enrollmentsByStudent(@Args('studentId', { type: () => ID }) studentId: string): Promise<StudentEnrollmentEntity[]> {
    return this.fsService.findEnrollmentsByStudent(studentId);
  }

  @Mutation(() => StudentEnrollmentEntity)
  async enrollStudent(@Args('input') input: EnrollStudentInput): Promise<StudentEnrollmentEntity> {
    return this.fsService.enrollStudent(input);
  }

  @Mutation(() => StudentEnrollmentEntity)
  async updateEnrollment(@Args('input') input: UpdateEnrollmentInput): Promise<StudentEnrollmentEntity> {
    return this.fsService.updateEnrollment(input);
  }

  @Mutation(() => Number)
  async calculateFinalGrade(
    @Args('enrollmentId', { type: () => ID }) enrollmentId: string,
    @Args('cycleRequiredClasses') cycleRequiredClasses: number,
  ): Promise<number> {
    return this.fsService.calculateFinalGrade(enrollmentId, cycleRequiredClasses);
  }

  @Query(() => [AttendanceEntity])
  async attendanceByCourseClass(@Args('courseClassId', { type: () => ID }) courseClassId: string): Promise<AttendanceEntity[]> {
    return this.fsService.findAttendanceByCourseClass(courseClassId);
  }

  @Query(() => [AttendanceEntity])
  async attendanceByEnrollment(@Args('enrollmentId', { type: () => ID }) enrollmentId: string): Promise<AttendanceEntity[]> {
    return this.fsService.findAttendanceByEnrollment(enrollmentId);
  }

  @Mutation(() => AttendanceEntity)
  async createAttendance(@Args('input') input: CreateAttendanceInput): Promise<AttendanceEntity> {
    return this.fsService.createAttendance(input);
  }
}

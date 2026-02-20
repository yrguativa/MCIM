import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
import { CreateCycleInput } from './dto/create-cycle.input';
import { CreateLevelInput } from './dto/create-level.input';
import { CreateClassroomInput } from './dto/create-classroom.input';
import { CreateScheduleInput, UpdateScheduleInput } from './dto/create-schedule.input';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateStudentInput, UpdateStudentInput } from './dto/create-student.input';
import { EnrollStudentInput, UpdateEnrollmentInput } from './dto/enroll-student.input';
import { CreateTeacherAssignmentInput } from './dto/teacher-assignment.input';
import { CreateAttendanceInput } from './dto/create-attendance.input';
import { CreateStudentCourseHistoryInput, UpdateStudentCourseHistoryInput } from './dto/create-student-course-history.input';
import { CycleEntity } from './entities/cycle.entity';
import { LevelEntity } from './entities/level.entity';
import { ClassroomEntity } from './entities/classroom.entity';
import { ScheduleEntity } from './entities/schedule.entity';
import { CourseEntity } from './entities/course.entity';
import { StudentEntity } from './entities/student.entity';
import { StudentEnrollmentEntity } from './entities/student-enrollment.entity';
import { TeacherAssignmentEntity } from './entities/teacher-assignment.entity';
import { AttendanceEntity } from './entities/attendance.entity';
import { StudentCourseHistoryEntity } from './entities/student-course-history.entity';
import * as QRCode from 'qrcode';

@Injectable()
export class FormationSchoolService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<Cycle>,
    @InjectModel(Level.name) private levelModel: Model<Level>,
    @InjectModel(Classroom.name) private classroomModel: Model<Classroom>,
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(StudentEnrollment.name) private enrollmentModel: Model<StudentEnrollment>,
    @InjectModel(TeacherAssignment.name) private teacherAssignmentModel: Model<TeacherAssignment>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(StudentCourseHistory.name) private courseHistoryModel: Model<StudentCourseHistory>,
  ) {}

  private toCycleEntity(cycle: Cycle & { _id: unknown }): CycleEntity {
    return {
      id: cycle._id?.toString() ?? '',
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      active: cycle.active,
      requiredClasses: cycle.requiredClasses,
      createdUser: cycle.createdUser,
      createdDate: cycle.createdDate,
      updatedUser: cycle.updatedUser,
      updatedDate: cycle.updatedDate,
    };
  }

  private toLevelEntity(level: Level & { _id: unknown }): LevelEntity {
    return {
      id: level._id?.toString() ?? '',
      name: level.name,
      description: level.description,
      order: level.order,
      createdUser: level.createdUser,
      createdDate: level.createdDate,
    };
  }

  private toClassroomEntity(classroom: Classroom & { _id: unknown }): ClassroomEntity {
    return {
      id: classroom._id?.toString() ?? '',
      name: classroom.name,
      capacity: classroom.capacity,
      location: classroom.location,
      createdUser: classroom.createdUser,
      createdDate: classroom.createdDate,
    };
  }

  private toScheduleEntity(schedule: Schedule & { _id: unknown }): ScheduleEntity {
    return {
      id: schedule._id?.toString() ?? '',
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      levelId: schedule.levelId,
      courseId: undefined,
      createdUser: schedule.createdUser,
      createdDate: schedule.createdDate,
    };
  }

  private toCourseEntity(course: Course & { _id: unknown }): CourseEntity {
    return {
      id: course._id?.toString() ?? '',
      cycleId: course.cycleId,
      levelId: course.levelId,
      teacherId: course.teacherId,
      classroomId: course.classroomId,
      scheduleId: course.scheduleId,
      type: course.type,
      requiredClasses: course.requiredClasses,
      qrCode: course.qrCode,
      qrExpiration: course.qrExpiration,
      createdUser: course.createdUser,
      createdDate: course.createdDate,
    };
  }

  private toStudentEntity(student: Student & { _id: unknown }): StudentEntity {
    return {
      id: student._id?.toString() ?? '',
      discipleId: student.discipleId,
      currentLevelId: student.currentLevelId,
      status: student.status,
      createdUser: student.createdUser,
      createdDate: student.createdDate,
    };
  }

  private toStudentEnrollmentEntity(enrollment: StudentEnrollment & { _id: unknown }): StudentEnrollmentEntity {
    return {
      id: enrollment._id?.toString() ?? '',
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      finalGrade: enrollment.finalGrade,
      createdUser: enrollment.createdUser,
      createdDate: enrollment.createdDate,
    };
  }

  private toTeacherAssignmentEntity(assignment: TeacherAssignment & { _id: unknown }): TeacherAssignmentEntity {
    return {
      id: assignment._id?.toString() ?? '',
      teacherId: assignment.teacherId,
      courseId: assignment.courseId,
      assignedDate: assignment.assignedDate,
      active: assignment.active,
      createdUser: assignment.createdUser,
      createdDate: assignment.createdDate,
    };
  }

  private toAttendanceEntity(attendance: Attendance & { _id: unknown }): AttendanceEntity {
    return {
      id: attendance._id?.toString() ?? '',
      studentEnrollmentId: attendance.studentEnrollmentId,
      courseId: attendance.courseId,
      attended: attendance.attended,
      attendanceDate: attendance.attendanceDate,
      notes: attendance.notes,
      createdUser: attendance.createdUser,
      createdDate: attendance.createdDate,
    };
  }

  private toStudentCourseHistoryEntity(history: StudentCourseHistory & { _id: unknown }): StudentCourseHistoryEntity {
    return {
      id: history._id?.toString() ?? '',
      studentId: history.studentId,
      courseId: history.courseId,
      enrollmentDate: history.enrollmentDate,
      completionDate: history.completionDate,
      finalGrade: history.finalGrade,
      status: history.status,
      promotedToNextLevel: history.promotedToNextLevel,
      createdUser: history.createdUser,
      createdDate: history.createdDate,
    };
  }

  async createCycle(input: CreateCycleInput): Promise<CycleEntity> {
    const cycle = new this.cycleModel({ ...input, createdDate: new Date() });
    const saved = await cycle.save();
    return this.toCycleEntity(saved);
  }

  async findAllCycles(): Promise<CycleEntity[]> {
    const cycles = await this.cycleModel.find().sort({ createdDate: -1 }).exec();
    return cycles.map(c => this.toCycleEntity(c));
  }

  async findCycleById(id: string): Promise<CycleEntity> {
    const cycle = await this.cycleModel.findById(id).exec();
    if (!cycle) throw new NotFoundException(`Cycle ${id} not found`);
    return this.toCycleEntity(cycle);
  }

  async findActiveCycle(): Promise<CycleEntity | null> {
    const cycle = await this.cycleModel.findOne({ active: true }).exec();
    return cycle ? this.toCycleEntity(cycle) : null;
  }

  async createLevel(input: CreateLevelInput): Promise<LevelEntity> {
    const level = new this.levelModel({ ...input, createdDate: new Date() });
    const saved = await level.save();
    return this.toLevelEntity(saved);
  }

  async findLevelsByCycle(cycleId: string): Promise<LevelEntity[]> {
    const levels = await this.levelModel.find({ cycleId }).sort({ order: 1 }).exec();
    return levels.map(l => this.toLevelEntity(l));
  }

  async findAllLevels(): Promise<LevelEntity[]> {
    const levels = await this.levelModel.find().sort({ order: 1 }).exec();
    return levels.map(l => this.toLevelEntity(l));
  }

  async createClassroom(input: CreateClassroomInput): Promise<ClassroomEntity> {
    const classroom = new this.classroomModel({ ...input, createdDate: new Date() });
    const saved = await classroom.save();
    return this.toClassroomEntity(saved);
  }

  async findAllClassrooms(): Promise<ClassroomEntity[]> {
    const classrooms = await this.classroomModel.find().exec();
    return classrooms.map(c => this.toClassroomEntity(c));
  }

  async createSchedule(input: CreateScheduleInput): Promise<ScheduleEntity> {
    const schedule = new this.scheduleModel({ ...input, createdDate: new Date() });
    const saved = await schedule.save();
    return this.toScheduleEntity(saved);
  }

  async updateSchedule(input: UpdateScheduleInput & { id: string }): Promise<ScheduleEntity> {
    const schedule = await this.scheduleModel.findById(input.id).exec();
    if (!schedule) {
      throw new NotFoundException('Horario no encontrado');
    }
    
    if (input.dayOfWeek !== undefined) schedule.dayOfWeek = input.dayOfWeek;
    if (input.startTime !== undefined) schedule.startTime = input.startTime;
    if (input.endTime !== undefined) schedule.endTime = input.endTime;
    if (input.levelId !== undefined) schedule.levelId = input.levelId;
    
    const saved = await schedule.save();
    return this.toScheduleEntity(saved);
  }

  async findAllSchedules(): Promise<ScheduleEntity[]> {
    const schedules = await this.scheduleModel.find().exec();
    return schedules.map(s => this.toScheduleEntity(s));
  }

  async createStudent(input: CreateStudentInput): Promise<StudentEntity> {
    const existingStudent = await this.studentModel.findOne({ discipleId: input.discipleId }).exec();
    if (existingStudent) {
      throw new BadRequestException('Ya existe un estudiante asociado a este discípulo');
    }
    
    const student = new this.studentModel({ ...input, createdDate: new Date() });
    const saved = await student.save();
    return this.toStudentEntity(saved);
  }

  async findAllStudents(): Promise<StudentEntity[]> {
    const students = await this.studentModel.find().populate('discipleId currentLevelId').exec();
    return students.map(s => this.toStudentEntity(s));
  }

  async findStudentById(id: string): Promise<StudentEntity> {
    const student = await this.studentModel.findById(id).populate('discipleId currentLevelId').exec();
    if (!student) throw new NotFoundException(`Student ${id} not found`);
    return this.toStudentEntity(student);
  }

  async findStudentByDiscipleId(discipleId: string): Promise<StudentEntity | null> {
    const student = await this.studentModel.findOne({ discipleId }).populate('currentLevelId').exec();
    return student ? this.toStudentEntity(student) : null;
  }

  async updateStudent(input: UpdateStudentInput): Promise<StudentEntity> {
    const { id, ...updateData } = input;
    const updated = await this.studentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Student ${id} not found`);
    return this.toStudentEntity(updated);
  }

  async deleteStudent(id: string): Promise<boolean> {
    const deleted = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Student ${id} not found`);
    return true;
  }

  async createCourse(input: CreateCourseInput): Promise<CourseEntity> {
    const hasConflict = await this.checkScheduleConflict(
      input.classroomId,
      input.scheduleId,
    );
    if (hasConflict) {
      throw new BadRequestException('Ya existe una clase en este salón con este horario');
    }
    
    const course = new this.courseModel({ ...input, createdDate: new Date() });
    const saved = await course.save();
    return this.toCourseEntity(saved);
  }

  async checkScheduleConflict(classroomId: string, scheduleId: string): Promise<boolean> {
    const existing = await this.courseModel.findOne({
      classroomId,
      scheduleId,
    }).exec();
    return !!existing;
  }

  async findCoursesByCycle(cycleId: string): Promise<CourseEntity[]> {
    const courses = await this.courseModel.find({ cycleId }).populate('levelId teacherId classroomId scheduleId').exec();
    return courses.map(c => this.toCourseEntity(c));
  }

  async findCoursesByTeacher(teacherId: string): Promise<CourseEntity[]> {
    const courses = await this.courseModel.find({ teacherId }).populate('levelId classroomId scheduleId cycleId').exec();
    return courses.map(c => this.toCourseEntity(c));
  }

  async generateQRCode(courseId: string): Promise<CourseEntity> {
    const qrData = JSON.stringify({
      courseId,
      expiration: Date.now() + 15 * 60 * 1000,
    });
    
    const qrCode = await QRCode.toDataURL(qrData);
    const qrExpiration = new Date(Date.now() + 15 * 60 * 1000);
    
    const updated = await this.courseModel.findByIdAndUpdate(
      courseId,
      { qrCode, qrExpiration },
      { new: true },
    ).exec();
    
    if (!updated) throw new NotFoundException(`Course ${courseId} not found`);
    return this.toCourseEntity(updated);
  }

  async enrollStudent(input: EnrollStudentInput): Promise<StudentEnrollmentEntity> {
    const enrollment = new this.enrollmentModel({
      ...input,
      enrollmentDate: new Date(),
      createdDate: new Date(),
    });
    const saved = await enrollment.save();
    return this.toStudentEnrollmentEntity(saved);
  }

  async enrollTeacher(input: CreateTeacherAssignmentInput): Promise<TeacherAssignmentEntity> {
    const assignment = new this.teacherAssignmentModel({
      ...input,
      assignedDate: new Date(),
      createdDate: new Date(),
    });
    const saved = await assignment.save();
    return this.toTeacherAssignmentEntity(saved);
  }

  async findEnrollmentsByCourse(courseId: string): Promise<StudentEnrollmentEntity[]> {
    const enrollments = await this.enrollmentModel.find({ courseId: courseId }).populate('studentId').exec();
    return enrollments.map(e => this.toStudentEnrollmentEntity(e));
  }

  async findEnrollmentsByStudent(studentId: string): Promise<StudentEnrollmentEntity[]> {
    const enrollments = await this.enrollmentModel.find({ studentId }).populate('courseId').exec();
    return enrollments.map(e => this.toStudentEnrollmentEntity(e));
  }

  async updateEnrollment(input: UpdateEnrollmentInput): Promise<StudentEnrollmentEntity> {
    const { id, ...updateData } = input;
    const updated = await this.enrollmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Enrollment ${id} not found`);
    return this.toStudentEnrollmentEntity(updated);
  }

  async calculateFinalGrade(enrollmentId: string, cycleRequiredClasses: number): Promise<number> {
    const attendanceCount = await this.attendanceModel.countDocuments({
      studentEnrollmentId: enrollmentId,
      attended: true,
    }).exec();
    
    const grade = (attendanceCount / cycleRequiredClasses) * 100;
    
    await this.enrollmentModel.findByIdAndUpdate(enrollmentId, { finalGrade: grade });
    
    return grade;
  }

  async promoteToNextLevel(enrollmentId: string, nextLevelId: string, userId: string): Promise<StudentEnrollmentEntity> {
    const currentEnrollment = await this.enrollmentModel.findById(enrollmentId).exec();
    if (!currentEnrollment) {
      throw new NotFoundException('Enrollment not found');
    }
    
    if ((currentEnrollment.finalGrade ?? 0) < 75) {
      throw new BadRequestException('El estudiante no ha completado el curso con la nota mínima requerida');
    }
    
    await this.enrollmentModel.findByIdAndUpdate(enrollmentId, {
      status: 'completed',
    });
    
    const newEnrollment = new this.enrollmentModel({
      studentId: currentEnrollment.studentId,
      courseId: '',
      enrollmentDate: new Date(),
      status: 'active',
      createdUser: userId,
      createdDate: new Date(),
    });
    
    const saved = await newEnrollment.save();
    return this.toStudentEnrollmentEntity(saved);
  }

  async createAttendance(input: CreateAttendanceInput): Promise<AttendanceEntity> {
    const attendance = new this.attendanceModel({
      ...input,
      createdDate: new Date(),
    });
    const saved = await attendance.save();
    return this.toAttendanceEntity(saved);
  }

  async findAttendanceByCourse(courseId: string): Promise<AttendanceEntity[]> {
    const attendances = await this.attendanceModel.find({ courseId: courseId })
      .populate('studentEnrollmentId')
      .exec();
    return attendances.map(a => this.toAttendanceEntity(a));
  }

  async findAttendanceByEnrollment(enrollmentId: string): Promise<AttendanceEntity[]> {
    const attendances = await this.attendanceModel.find({ studentEnrollmentId: enrollmentId }).exec();
    return attendances.map(a => this.toAttendanceEntity(a));
  }

  async createCourseHistory(input: CreateStudentCourseHistoryInput): Promise<StudentCourseHistoryEntity> {
    const history = new this.courseHistoryModel({
      ...input,
      enrollmentDate: input.enrollmentDate || new Date(),
      createdDate: new Date(),
    });
    const saved = await history.save();
    return this.toStudentCourseHistoryEntity(saved);
  }

  async findCourseHistoriesByStudent(studentId: string): Promise<StudentCourseHistoryEntity[]> {
    const histories = await this.courseHistoryModel.find({ studentId }).populate('courseId').exec();
    return histories.map(h => this.toStudentCourseHistoryEntity(h));
  }

  async updateCourseHistory(input: UpdateStudentCourseHistoryInput): Promise<StudentCourseHistoryEntity> {
    const { id, ...updateData } = input;
    const updated = await this.courseHistoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Course history ${id} not found`);
    return this.toStudentCourseHistoryEntity(updated);
  }
}

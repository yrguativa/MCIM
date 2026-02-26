import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FormationSchoolService } from '../services/formation-school.services';
import { Student, Cycle, Level, Classroom, Schedule, Course, StudentEnrollment, TeacherAssignment, Attendance, StudentCourseHistory } from '../models';

interface FormationSchoolState {
  students: Student[];
  cycles: Cycle[];
  levels: Level[];
  classrooms: Classroom[];
  schedules: Schedule[];
  courses: Course[];
  enrollments: StudentEnrollment[];
  teacherAssignments: TeacherAssignment[];
  attendances: Attendance[];
  courseHistories: StudentCourseHistory[];
  activeCycle: Cycle | null;
  
  getStudents: () => Promise<void>;
  getStudentById: (id: string) => Promise<Student | null>;
  createStudent: (student: Partial<Student>) => Promise<boolean>;
  updateStudent: (student: Partial<Student>) => Promise<boolean>;
  deleteStudent: (id: string) => Promise<boolean>;
  getCycles: () => Promise<void>;
  getActiveCycle: () => Promise<void>;
  createCycle: (cycle: Partial<Cycle>) => Promise<boolean>;
  updateCycle: (cycle: Partial<Cycle>) => Promise<boolean>;
  
  getLevelsByCycle: (cycleId: string) => Promise<void>;
  getLevels: () => Promise<void>;
  createLevel: (level: Partial<Level>) => Promise<boolean>;
  updateLevel: (level: Partial<Level>) => Promise<boolean>;
  
  getClassrooms: () => Promise<void>;
  createClassroom: (classroom: Partial<Classroom>) => Promise<boolean>;
  updateClassroom: (classroom: Partial<Classroom>) => Promise<boolean>;

  getSchedules: () => Promise<void>;
  createSchedule: (schedule: Partial<Schedule>) => Promise<boolean>;
  updateSchedule: (schedule: Partial<Schedule>) => Promise<boolean>;
  
  getCoursesByCycle: (cycleId: string) => Promise<void>;
  getCoursesByTeacher: (teacherId: string) => Promise<void>;
  createCourse: (course: Partial<Course>) => Promise<boolean>;
  updateCourse: (course: Partial<Course>) => Promise<boolean>;
  generateQRCode: (courseId: string) => Promise<{ id: string; qrCode: string; qrExpiration: Date }>;
  
  getEnrollmentsByCourse: (courseId: string) => Promise<void>;
  getEnrollmentsByStudent: (studentId: string) => Promise<void>;
  enrollStudent: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  enrollTeacher: (assignment: Partial<TeacherAssignment>) => Promise<boolean>;
  updateEnrollment: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  calculateFinalGrade: (enrollmentId: string, requiredClasses: number) => Promise<number>;
  
  getAttendanceByCourse: (courseId: string) => Promise<void>;
  getAttendanceByEnrollment: (enrollmentId: string) => Promise<void>;
  createAttendance: (attendance: Partial<Attendance>) => Promise<boolean>;
  
  getCourseHistoriesByStudent: (studentId: string) => Promise<void>;
  createCourseHistory: (history: Partial<StudentCourseHistory>) => Promise<boolean>;
  updateCourseHistory: (history: Partial<StudentCourseHistory>) => Promise<boolean>;
}

const store: StateCreator<FormationSchoolState> = (set, get) => ({
  students: [],
  cycles: [],
  levels: [],
  classrooms: [],
  schedules: [],
  courses: [],
  enrollments: [],
  teacherAssignments: [],
  attendances: [],
  courseHistories: [],
  activeCycle: null,

  getStudents: async () => {
    const data = await FormationSchoolService.getStudents();
    set({ students: data.students });
  },

  getStudentById: async (id: string) => {
    const data = await FormationSchoolService.getStudentById(id);
    return data.student;
  },

  createStudent: async (student) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...studentData } = student as Record<string, unknown>;
      await FormationSchoolService.createStudent({
        ...studentData,
        createdUser: (studentData.createdUser as string) || 'system',
      });
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error creating student:', error);
      return false;
    }
  },

  updateStudent: async (student) => {
    try {
      await FormationSchoolService.updateStudent(student);
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      await FormationSchoolService.deleteStudent(id);
      await get().getStudents();
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  },

  getCycles: async () => {
    const data = await FormationSchoolService.getCycles();
    set({ cycles: data.cycles });
  },

  getActiveCycle: async () => {
    const data = await FormationSchoolService.getActiveCycle();
    set({ activeCycle: data.activeCycle });
  },

  createCycle: async (cycle) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...cycleData } = cycle as Record<string, unknown>;
      await FormationSchoolService.createCycle({
        ...cycleData,
        createdUser: (cycleData.createdUser as string) || 'system',
      });
      await get().getCycles();
      return true;
    } catch (error) {
      console.error('Error creating cycle:', error);
      return false;
    }
  },

  updateCycle: async (cycle) => {
    try {
      await FormationSchoolService.updateCycle(cycle);
      await get().getCycles();
      return true;
    } catch (error) {
      console.error('Error updating cycle:', error);
      return false;
    }
  },

  getLevelsByCycle: async (cycleId: string) => {
    const data = await FormationSchoolService.getLevelsByCycle(cycleId);
    set({ levels: data.levelsByCycle });
  },

  getLevels: async () => {
    const data = await FormationSchoolService.getLevels();
    set({ levels: data.levels });
  },

  createLevel: async (level) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...levelData } = level as Record<string, unknown>;
      await FormationSchoolService.createLevel({
        ...levelData,
        createdUser: (levelData.createdUser as string) || 'system',
      });
      await get().getLevels();
      return true;
    } catch (error) {
      console.error('Error creating level:', error);
      return false;
    }
  },

  updateLevel: async (level) => {
    try {
      await FormationSchoolService.updateLevel(level);
      await get().getLevels();
      return true;
    } catch (error) {
      console.error('Error updating level:', error);
      return false;
    }
  },

  getClassrooms: async () => {
    const data = await FormationSchoolService.getClassrooms();
    set({ classrooms: data.classrooms });
  },

  createClassroom: async (classroom) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...classroomData } = classroom as Record<string, unknown>;
      await FormationSchoolService.createClassroom({
        ...classroomData,
        createdUser: (classroomData.createdUser as string) || 'system',
      });
      await get().getClassrooms();
      return true;
    } catch (error) {
      console.error('Error creating classroom:', error);
      return false;
    }
  },

  updateClassroom: async (classroom) => {
    try {
      await FormationSchoolService.updateClassroom(classroom);
      await get().getClassrooms();
      return true;
    } catch (error) {
      console.error('Error updating classroom:', error);
      return false;
    }
  },

  getSchedules: async () => {
    const data = await FormationSchoolService.getSchedules();
    set({ schedules: data.schedules });
  },

  createSchedule: async (schedule) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...scheduleData } = schedule as Record<string, unknown>;
      await FormationSchoolService.createSchedule({
        ...scheduleData,
        createdUser: (scheduleData.createdUser as string) || 'system',
      });
      await get().getSchedules();
      return true;
    } catch (error) {
      console.error('Error creating schedule:', error);
      return false;
    }
  },

  updateSchedule: async (schedule) => {
    try {
      await FormationSchoolService.updateSchedule(schedule);
      await get().getSchedules();
      return true;
    } catch (error) {
      console.error('Error updating schedule:', error);
      return false;
    }
  },

  getCoursesByCycle: async (cycleId: string) => {
    const data = await FormationSchoolService.getCoursesByCycle(cycleId);
    set({ courses: data.coursesByCycle });
  },

  getCoursesByTeacher: async (teacherId: string) => {
    const data = await FormationSchoolService.getCoursesByTeacher(teacherId);
    set({ courses: data.coursesByTeacher });
  },

  createCourse: async (course) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, ...courseData } = course as Record<string, unknown>;
      await FormationSchoolService.createCourse({
        ...courseData,
        createdUser: (courseData.createdUser as string) || 'system',
      });
      await get().getCoursesByCycle((course as Record<string, unknown>).cycleId as string);
      return true;
    } catch (error) {
      console.error('Error creating course:', error);
      return false;
    }
  },

  updateCourse: async (course) => {
    try {
      await FormationSchoolService.updateCourse(course);
      await get().getCoursesByCycle(course.cycleId!);
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      return false;
    }
  },

  generateQRCode: async (courseId: string) => {
    const data = await FormationSchoolService.generateQRCode(courseId);
    return data.generateQRCode;
  },

  getEnrollmentsByCourse: async (courseId: string) => {
    const data = await FormationSchoolService.getEnrollmentsByCourse(courseId);
    set({ enrollments: data.enrollmentsByCourse });
  },

  getEnrollmentsByStudent: async (studentId: string) => {
    const data = await FormationSchoolService.getEnrollmentsByStudent(studentId);
    set({ enrollments: data.enrollmentsByStudent });
  },

  enrollStudent: async (enrollment) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, enrollmentDate: _enrollmentDate, ...enrollmentData } = enrollment as Record<string, unknown>;
      await FormationSchoolService.enrollStudent({
        ...enrollmentData,
        createdUser: (enrollmentData.createdUser as string) || 'system',
        enrollmentDate: new Date(),
      });
      await get().getEnrollmentsByCourse((enrollment as Record<string, unknown>).courseId as string);
      return true;
    } catch (error) {
      console.error('Error enrolling student:', error);
      return false;
    }
  },

  enrollTeacher: async (assignment) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, assignedDate: _assignedDate, ...assignmentData } = assignment as Record<string, unknown>;
      await FormationSchoolService.enrollTeacher({
        ...assignmentData,
        createdUser: (assignmentData.createdUser as string) || 'system',
        assignedDate: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error enrolling teacher:', error);
      return false;
    }
  },

  updateEnrollment: async (enrollment) => {
    try {
      await FormationSchoolService.updateEnrollment(enrollment);
      return true;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      return false;
    }
  },

  calculateFinalGrade: async (enrollmentId, requiredClasses) => {
    return FormationSchoolService.calculateFinalGrade(enrollmentId, requiredClasses);
  },

  getAttendanceByCourse: async (courseId: string) => {
    const data = await FormationSchoolService.getAttendanceByCourse(courseId);
    set({ attendances: data.attendanceByCourse });
  },

  getAttendanceByEnrollment: async (enrollmentId: string) => {
    const data = await FormationSchoolService.getAttendanceByEnrollment(enrollmentId);
    set({ attendances: data.attendanceByEnrollment });
  },

  createAttendance: async (attendance) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, attendanceDate: _attendanceDate, ...attendanceData } = attendance as Record<string, unknown>;
      await FormationSchoolService.createAttendance({
        ...attendanceData,
        createdUser: (attendanceData.createdUser as string) || 'system',
        attendanceDate: new Date(),
      });
      await get().getAttendanceByCourse((attendance as Record<string, unknown>).courseId as string);
      return true;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return false;
    }
  },

  getCourseHistoriesByStudent: async (studentId: string) => {
    const data = await FormationSchoolService.getCourseHistoriesByStudent(studentId);
    set({ courseHistories: data.courseHistoriesByStudent });
  },

  createCourseHistory: async (history) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, createdDate: _createdDate, enrollmentDate: _enrollmentDate, ...historyData } = history as Record<string, unknown>;
      await FormationSchoolService.createCourseHistory({
        ...historyData,
        createdUser: (historyData.createdUser as string) || 'system',
        enrollmentDate: (historyData.enrollmentDate as Date) ? new Date(historyData.enrollmentDate as Date) : new Date(),
      });
      await get().getCourseHistoriesByStudent((history as Record<string, unknown>).studentId as string);
      return true;
    } catch (error) {
      console.error('Error creating course history:', error);
      return false;
    }
  },

  updateCourseHistory: async (history) => {
    try {
      await FormationSchoolService.updateCourseHistory(history);
      await get().getCourseHistoriesByStudent(history.studentId!);
      return true;
    } catch (error) {
      console.error('Error updating course history:', error);
      return false;
    }
  },
});

export const useFormationSchoolStore = create<FormationSchoolState>()(
  devtools(persist(store, { name: 'formation-school-storage' }))
);

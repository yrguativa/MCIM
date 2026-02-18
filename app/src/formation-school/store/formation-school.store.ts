import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FormationSchoolService } from '../services/formation-school.services';
import { Cycle, Level, Classroom, Schedule, Course, StudentEnrollment, Attendance } from '../models';

interface FormationSchoolState {
  cycles: Cycle[];
  levels: Level[];
  classrooms: Classroom[];
  schedules: Schedule[];
  courses: Course[];
  enrollments: StudentEnrollment[];
  attendances: Attendance[];
  activeCycle: Cycle | null;
  
  getCycles: () => Promise<void>;
  getActiveCycle: () => Promise<void>;
  createCycle: (cycle: Partial<Cycle>) => Promise<boolean>;
  
  getLevelsByCycle: (cycleId: string) => Promise<void>;
  createLevel: (level: Partial<Level>) => Promise<boolean>;
  
  getClassrooms: () => Promise<void>;
  createClassroom: (classroom: Partial<Classroom>) => Promise<boolean>;
  
  getSchedules: () => Promise<void>;
  createSchedule: (schedule: Partial<Schedule>) => Promise<boolean>;
  
  getCoursesByCycle: (cycleId: string) => Promise<void>;
  getCoursesByTeacher: (teacherId: string) => Promise<void>;
  createCourse: (course: Partial<Course>) => Promise<boolean>;
  generateQRCode: (courseId: string) => Promise<{ id: string; qrCode: string; qrExpiration: Date }>;
  
  getEnrollmentsByCourse: (courseId: string) => Promise<void>;
  getEnrollmentsByStudent: (studentId: string) => Promise<void>;
  enrollStudent: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  updateEnrollment: (enrollment: Partial<StudentEnrollment>) => Promise<boolean>;
  calculateFinalGrade: (enrollmentId: string, requiredClasses: number) => Promise<number>;
  
  getAttendanceByCourse: (courseId: string) => Promise<void>;
  getAttendanceByEnrollment: (enrollmentId: string) => Promise<void>;
  createAttendance: (attendance: Partial<Attendance>) => Promise<boolean>;
}

const store: StateCreator<FormationSchoolState> = (set, get) => ({
  cycles: [],
  levels: [],
  classrooms: [],
  schedules: [],
  courses: [],
  enrollments: [],
  attendances: [],
  activeCycle: null,

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
      const { id, createdDate, createdUser, ...cycleData } = cycle as any;
      await FormationSchoolService.createCycle(cycleData);
      await get().getCycles();
      return true;
    } catch (error) {
      console.error('Error creating cycle:', error);
      return false;
    }
  },

  getLevelsByCycle: async (cycleId: string) => {
    const data = await FormationSchoolService.getLevelsByCycle(cycleId);
    set({ levels: data.levelsByCycle });
  },

  createLevel: async (level) => {
    try {
      const { id, createdDate, createdUser, ...levelData } = level as any;
      await FormationSchoolService.createLevel(levelData);
      await get().getLevelsByCycle(level.cycleId!);
      return true;
    } catch (error) {
      console.error('Error creating level:', error);
      return false;
    }
  },

  getClassrooms: async () => {
    const data = await FormationSchoolService.getClassrooms();
    set({ classrooms: data.classrooms });
  },

  createClassroom: async (classroom) => {
    try {
      const { id, createdDate, createdUser, ...classroomData } = classroom as any;
      await FormationSchoolService.createClassroom(classroomData);
      await get().getClassrooms();
      return true;
    } catch (error) {
      console.error('Error creating classroom:', error);
      return false;
    }
  },

  getSchedules: async () => {
    const data = await FormationSchoolService.getSchedules();
    set({ schedules: data.schedules });
  },

  createSchedule: async (schedule) => {
    try {
      const { id, createdDate, createdUser, ...scheduleData } = schedule as any;
      await FormationSchoolService.createSchedule(scheduleData);
      await get().getSchedules();
      return true;
    } catch (error) {
      console.error('Error creating schedule:', error);
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
      const { id, createdDate, createdUser, ...courseData } = course as any;
      await FormationSchoolService.createCourse(courseData);
      await get().getCoursesByCycle(course.cycleId!);
      return true;
    } catch (error) {
      console.error('Error creating course:', error);
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
      const { id, createdDate, createdUser, enrollmentDate, ...enrollmentData } = enrollment as any;
      await FormationSchoolService.enrollStudent(enrollmentData);
      await get().getEnrollmentsByCourse(enrollment.courseId!);
      return true;
    } catch (error) {
      console.error('Error enrolling student:', error);
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
      const { id, createdDate, createdUser, attendanceDate, ...attendanceData } = attendance as any;
      await FormationSchoolService.createAttendance(attendanceData);
      await get().getAttendanceByCourse(attendance.courseId!);
      return true;
    } catch (error) {
      console.error('Error creating attendance:', error);
      return false;
    }
  },
});

export const useFormationSchoolStore = create<FormationSchoolState>()(
  devtools(persist(store, { name: 'formation-school-storage' }))
);

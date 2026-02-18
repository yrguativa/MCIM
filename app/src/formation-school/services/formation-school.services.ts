import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function graphqlRequest(query: string, variables?: Record<string, unknown>) {
  const { data } = await api.post(API_URL, JSON.stringify({ query, variables }));
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

export const FormationSchoolService = {
  async getStudents() {
    const query = `query { students { id discipleId currentLevelId status createdUser createdDate } }`;
    return graphqlRequest(query);
  },

  async getStudentById(id: string) {
    const query = `query Student($id: ID!) { student(id: $id) { id discipleId currentLevelId status createdUser createdDate } }`;
    return graphqlRequest(query, { id });
  },

  async createStudent(input: Record<string, unknown>) {
    const query = `mutation CreateStudent($input: CreateStudentInput!) { createStudent(input: $input) { id discipleId currentLevelId status } }`;
    return graphqlRequest(query, { input });
  },

  async updateStudent(input: Record<string, unknown>) {
    const query = `mutation UpdateStudent($input: UpdateStudentInput!) { updateStudent(input: $input) { id discipleId currentLevelId status } }`;
    return graphqlRequest(query, { input });
  },

  async deleteStudent(id: string) {
    const query = `mutation DeleteStudent($id: ID!) { deleteStudent(id: $id) }`;
    return graphqlRequest(query, { id });
  },

  async getCycles() {
    const query = `query { cycles { id name startDate endDate requiredClasses active } }`;
    return graphqlRequest(query);
  },
  
  async getActiveCycle() {
    const query = `query { activeCycle { id name startDate endDate requiredClasses active } }`;
    return graphqlRequest(query);
  },
  
  async createCycle(input: Record<string, unknown>) {
    const query = `mutation CreateCycle($input: CreateCycleInput!) { createCycle(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getLevelsByCycle(cycleId: string) {
    const query = `query LevelsByCycle($cycleId: ID!) { levelsByCycle(cycleId: $cycleId) { id name description order type } }`;
    return graphqlRequest(query, { cycleId });
  },

  async getLevels() {
    const query = `query { levels { id name description order type } }`;
    return graphqlRequest(query);
  },
  
  async createLevel(input: Record<string, unknown>) {
    const query = `mutation CreateLevel($input: CreateLevelInput!) { createLevel(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getClassrooms() {
    const query = `query { classrooms { id name capacity location } }`;
    return graphqlRequest(query);
  },
  
  async createClassroom(input: Record<string, unknown>) {
    const query = `mutation CreateClassroom($input: CreateClassroomInput!) { createClassroom(input: $input) { id name } }`;
    return graphqlRequest(query, { input });
  },

  async getSchedules() {
    const query = `query { schedules { id dayOfWeek startTime endTime } }`;
    return graphqlRequest(query);
  },
  
  async createSchedule(input: Record<string, unknown>) {
    const query = `mutation CreateSchedule($input: CreateScheduleInput!) { createSchedule(input: $input) { id } }`;
    return graphqlRequest(query, { input });
  },

  async getCoursesByCycle(cycleId: string) {
    const query = `query CoursesByCycle($cycleId: ID!) { coursesByCycle(cycleId: $cycleId) { id levelId teacherId classroomId scheduleId cycleId qrCode qrExpiration } }`;
    return graphqlRequest(query, { cycleId });
  },
  
  async getCoursesByTeacher(teacherId: string) {
    const query = `query CoursesByTeacher($teacherId: ID!) { coursesByTeacher(teacherId: $teacherId) { id levelId teacherId classroomId scheduleId cycleId qrCode qrExpiration } }`;
    return graphqlRequest(query, { teacherId });
  },
  
  async createCourse(input: Record<string, unknown>) {
    const query = `mutation CreateCourse($input: CreateCourseInput!) { createCourse(input: $input) { id } }`;
    return graphqlRequest(query, { input });
  },
  
  async generateQRCode(courseId: string) {
    const query = `mutation GenerateQRCode($courseId: ID!) { generateQRCode(courseId: $courseId) { id qrCode qrExpiration } }`;
    return graphqlRequest(query, { courseId });
  },

  async getEnrollmentsByCourse(courseId: string) {
    const query = `query EnrollmentsByCourse($courseId: ID!) { enrollmentsByCourse(courseId: $courseId) { id studentId courseId enrollmentDate status finalGrade } }`;
    return graphqlRequest(query, { courseId });
  },
  
  async getEnrollmentsByStudent(studentId: string) {
    const query = `query EnrollmentsByStudent($studentId: ID!) { enrollmentsByStudent(studentId: $studentId) { id studentId courseId enrollmentDate status finalGrade } }`;
    return graphqlRequest(query, { studentId });
  },
  
  async enrollStudent(input: Record<string, unknown>) {
    const query = `mutation EnrollStudent($input: EnrollStudentInput!) { enrollStudent(input: $input) { id studentId courseId status } }`;
    return graphqlRequest(query, { input });
  },
  
  async enrollTeacher(input: Record<string, unknown>) {
    const query = `mutation EnrollTeacher($input: EnrollTeacherInput!) { enrollTeacher(input: $input) { id teacherId courseId active } }`;
    return graphqlRequest(query, { input });
  },
   
  async updateEnrollment(input: Record<string, unknown>) {
    const query = `mutation UpdateEnrollment($input: UpdateEnrollmentInput!) { updateEnrollment(input: $input) { id status finalGrade } }`;
    return graphqlRequest(query, { input });
  },
  
  async calculateFinalGrade(enrollmentId: string, cycleRequiredClasses: number) {
    const query = `mutation CalculateFinalGrade($enrollmentId: ID!, $cycleRequiredClasses: Float!) { calculateFinalGrade(enrollmentId: $enrollmentId, cycleRequiredClasses: $cycleRequiredClasses) }`;
    return graphqlRequest(query, { enrollmentId, cycleRequiredClasses });
  },

  async getAttendanceByCourse(courseId: string) {
    const query = `query AttendanceByCourse($courseId: ID!) { attendanceByCourse(courseId: $courseId) { id studentEnrollmentId courseId attended attendanceDate notes } }`;
    return graphqlRequest(query, { courseId });
  },
  
  async getAttendanceByEnrollment(enrollmentId: string) {
    const query = `query AttendanceByEnrollment($enrollmentId: ID!) { attendanceByEnrollment(enrollmentId: $enrollmentId) { id studentEnrollmentId courseId attended attendanceDate notes } }`;
    return graphqlRequest(query, { enrollmentId });
  },
  
  async createAttendance(input: Record<string, unknown>) {
    const query = `mutation CreateAttendance($input: CreateAttendanceInput!) { createAttendance(input: $input) { id attended } }`;
    return graphqlRequest(query, { input });
  },
};

export interface Attendance {
    id: string;
    studentEnrollmentId: string;
    courseClassId: string;
    attended: boolean;
    attendanceDate: Date;
    notes?: string;
    createdUser: string;
    createdDate: Date;
}

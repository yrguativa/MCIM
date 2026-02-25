export interface TeacherAssignment {
    id: string;
    teacherId: string;
    courseId?: string;
    assignedDate: Date;
    active: boolean;
    createdUser: string;
    createdDate: Date;
}

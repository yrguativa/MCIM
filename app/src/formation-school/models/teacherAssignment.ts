export interface TeacherAssignment {
    id: string;
    teacherId: string;
    courseClassId: string;
    assignedDate: Date;
    active: boolean;
    createdUser: string;
    createdDate: Date;
}

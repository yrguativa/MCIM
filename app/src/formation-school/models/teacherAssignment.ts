export interface TeacherAssignment {
    id: string;
    teacherId: string;
    type?: 'teacher' | 'tutor';
    courseId?: string;
    assignedDate: Date;
    active: boolean;
    createdUser: string;
    createdDate: Date;
}

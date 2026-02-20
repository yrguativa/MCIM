export interface Student {
    id: string;
    discipleId: string;
    disciple?: { id: string; name: string; lastName: string; identification: string };
    currentLevelId: string;
    status: 'active' | 'inactive';
    createdUser: string;
    createdDate: Date;
}

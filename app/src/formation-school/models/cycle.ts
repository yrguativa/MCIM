export interface Cycle {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
    requiredClasses?: number;
    createdUser: string;
    createdDate: Date;
    updatedUser?: string;
    updatedDate?: Date;
}

export interface Disciple {
    id: string;
    identification: string;
    identificationType: string;
    name: string;
    lastName: string;
    names?: string;
    lastNames?: string;
    email: string | undefined;
    phone: string | undefined;
    ministryId: string;
    leaderId?: string;
    network?: string;
    status?: string;

    createdUser: string;
    createdDate: Date;
    updatedUser: string;
    updatedDate: Date;
}

export interface Disciple {
    id: string;
    identification:string;
    name: string;
    lastName: string;
    email: string | undefined;
    phone: string | undefined;
    address: string | undefined;
    birthDate: Date | undefined;
    ministryId: string;
    
    createdUser: string;
    createdDate: Date;
    updatedUser: string;
    updatedDate: Date;
}
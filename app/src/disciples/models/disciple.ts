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

export interface DisciplePersonalInfo {
    id: string;
    discipleId: string;
    nationality: string;
    gender: string;
    maritalStatus?: string;
    hasChildren: string;
    childrenAttendChurch?: string;
    address: string;
    housingComplex?: string;
    neighborhood: string;
    municipality: string;
    network: string;
    birthDate: string;
    ministryId: string;
    yearArrivedAtChurch: string;
    attendedAnotherChurch?: string;
    yearArrivedAtOtherChurch?: string;
    otherChurchName?: string;
    hasAttendedEncounter: string;
    yearAttendedEncounter?: string;
    hasRepeatedEncounter?: string;
    hasAttendedReencounter: string;
    yearAttendedReencounter?: string;
    baptizedAtMCI: string;
    isLeader?: string;
    generation: string;
    rh?: string;
    contactName?: string;
    contactPhone?: string;
    formationSchoolLevel: string;
    createdAt: string;
    updatedAt: string;
}

export interface DiscipleFull {
    disciple: Disciple;
    personalInfo?: DisciplePersonalInfo | null;
}

export interface Leader {
    id: string;
    names: string;
    lastNames: string;
}

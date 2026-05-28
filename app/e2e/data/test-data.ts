export interface TestDisciple {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  identificationType: string;
  identification: string;
  ministry: string;
}

export interface TestSpouse {
  attendsChurch: 'YES' | 'NO';
  spouseName?: string;
}

export interface TestChild {
  name: string;
  age: string;
  attendsChurch: 'YES' | 'NO';
}

export function createNewDisciple(overrides?: Partial<TestDisciple>): TestDisciple {
  return {
    name: 'Carlos',
    lastName: 'Martínez',
    email: 'carlos@example.com',
    phone: '3001234567',
    identificationType: 'CC',
    identification: '123456789',
    ministry: 'Ps. Arvey & Jeimy',
    ...overrides,
  };
}

export function existingDisciplesList() {
  return [
    { id: 'd1', name: 'Juan Piratova', identification: '1034397364' },
    { id: 'd2', name: 'María López', identification: '9876543210' },
    { id: 'd3', name: 'Paula Coca', identification: '52345678' },
  ];
}

export function sampleChildren(): TestChild[] {
  return [
    { name: 'Hijo Uno', age: '5', attendsChurch: 'YES' },
    { name: 'Hijo Dos', age: '3', attendsChurch: 'NO' },
  ];
}

export const formData = {
  names: 'Carlos Andrés',
  lastNames: 'Martínez López',
  email: 'carlos.martinez@example.com',
  phone: '3001234567',
  identificationType: 'C.C. - Cédula de Ciudadanía',
  identification: '1234567890',
  nationality: 'Colombiana',
  gender: 'Masculino',
  rh: 'O+',
  maritalStatus: 'Casado(a)',
  address: 'Cra 8 # 15-30',
  housingComplex: 'Conjunto Residencial El Parque',
  neighborhood: 'Centro',
  municipality: 'Mosquera',
  network: 'Jóvenes',
  birthDate: { day: '15', month: '04', year: '1995' },
  ministry: 'Ps. Arvey & Jeimy',
  yearArrivedAtChurch: '2018',
  otherChurchYear: '2015',
  otherChurchName: 'Bogotá D.C.',
  encounterYear: '2022',
  reencounterYear: '2024',
  contactName: 'María López',
  contactPhone: '3007654321',
  spouseName: 'Ana María García',
  spouseDisciple: 'Paula Coca',
  formationLevel: 'Graduado',
};

export const cellData = {
  day: 'Miércoles',
  time: '07:00',
  address: 'Calle 123 # 45-67',
  neighborhood: 'CENTRO MOSQUERA',
  yearOpened: '2026',
  host: 'Juan Piratova',
  timoteo: 'María López',
};

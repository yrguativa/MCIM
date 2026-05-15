import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockDisciples = [
  {
    id: '1',
    identification: '12345',
    identificationType: 'CC',
    name: 'Juan',
    lastName: 'Pérez',
    ministryId: 'm1',
    leaderId: 'leader1',
    email: undefined,
    phone: undefined,
    network: undefined,
    status: undefined,
    createdUser: 'u1',
    createdDate: new Date(),
    updatedUser: 'u1',
    updatedDate: new Date(),
  },
  {
    id: '2',
    identification: '67890',
    identificationType: 'CC',
    name: 'María',
    lastName: 'Gómez',
    ministryId: 'm1',
    leaderId: 'leader2',
    email: undefined,
    phone: undefined,
    network: undefined,
    status: undefined,
    createdUser: 'u1',
    createdDate: new Date(),
    updatedUser: 'u1',
    updatedDate: new Date(),
  },
];

vi.mock('@/src/disciples/store/disciple.store', () => ({
  useDiscipleStore: vi.fn(),
}));

vi.mock('@/src/app/stores', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'u1' },
  })),
}));

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { AddAttendeeModal } from './AddAttendeeModal';

describe('AddAttendeeModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSelect: vi.fn(),
    cellLeaderId: 'leader1',
  };

  beforeEach(() => {
    const mockStore = {
      Disciples: mockDisciples,
      addDisciple: vi.fn(),
    };
    (useDiscipleStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (s: typeof mockStore) => unknown) => selector ? selector(mockStore) : mockStore
    );
  });

  it('renders the dialog when open is true', () => {
    render(<AddAttendeeModal {...defaultProps} />);
    expect(screen.getByText('Agregar Asistente')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
  });

  it('shows search tab with disciple list', () => {
    render(<AddAttendeeModal {...defaultProps} />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María Gómez')).toBeInTheDocument();
  });

  it('switches to create tab when clicking Nuevo', async () => {
    const user = userEvent.setup();
    render(<AddAttendeeModal {...defaultProps} />);
    const nuevoTab = screen.getByRole('tab', { name: /nuevo/i });
    await user.click(nuevoTab);
    expect(screen.getByText('Guardar y Agregar')).toBeInTheDocument();
  });
});

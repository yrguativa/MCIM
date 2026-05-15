import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('@/src/disciples/store/disciple.store', () => ({
  useDiscipleStore: vi.fn(),
}));

vi.mock('@/src/app/stores', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: 'user-1' },
  })),
}));

vi.mock('../store/cell.store', () => ({
  useCellStore: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

import { useDiscipleStore } from '@/src/disciples/store/disciple.store';
import { useCellStore } from '../store/cell.store';
import CellForm from './cellForm';

describe('cellForm', () => {
  beforeEach(() => {
    const mockDiscipleStore = {
      Disciples: [],
      getDisciples: vi.fn(),
    };
    (useDiscipleStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (s: typeof mockDiscipleStore) => unknown) => selector ? selector(mockDiscipleStore) : mockDiscipleStore
    );

    const mockCellStore = {
      Cells: [],
      getCell: vi.fn(),
      addCell: vi.fn(),
      updateCell: vi.fn(),
      addRecord: vi.fn(),
      addAssistant: vi.fn(),
      deactivateAssistant: vi.fn(),
    };
    (useCellStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (s: typeof mockCellStore) => unknown) => selector ? selector(mockCellStore) : mockCellStore
    );
  });

  it('shows assistants card always, with guardar mensaje in create mode', async () => {
    render(
      <MemoryRouter initialEntries={['/cells/create']}>
        <Routes>
          <Route path="/cells/create" element={<CellForm />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Asistentes de la Célula')).toBeInTheDocument();
    expect(screen.getByText('Guarda la célula para gestionar los asistentes.')).toBeInTheDocument();
    expect(screen.getByText('Agregar Asistente')).toBeInTheDocument();
  });
});

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

export const user = userEvent.setup();

window.URL.createObjectURL = vi.fn(() => 'blob:mock');
window.URL.revokeObjectURL = vi.fn();

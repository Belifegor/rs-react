import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';

vi.mock('../../store/useCountriesStore', () => {
  const state = {
    countries: [
      'Moldova',
      'Romania',
      'Ukraine',
      'Russia',
      'Germany',
      'France',
      'Finland',
      'Iceland',
      'Ireland',
      'Thailand',
      'Japan',
      'Canada',
      'Angola',
      'Argentina',
      'Australia',
      'Austria',
    ],
  };
  return {
    useCountriesStore: (sel: (s: typeof state) => unknown) => sel(state),
  };
});

import CountryAutocomplete from './CountryAutocomplete';

function Controlled({ initial = '' }: { initial?: string }) {
  const [val, setVal] = useState(initial);
  return (
    <CountryAutocomplete
      value={val}
      onChange={setVal}
      inputId="country-input"
      placeholder="Start typing a country"
    />
  );
}

describe('CountryAutocomplete (short)', () => {
  it('рендерит input и открывает список по фокусу (<=10 элементов, ARIA корректны)', async () => {
    render(<Controlled />);
    const user = userEvent.setup();

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveAttribute('placeholder', 'Start typing a country');

    await user.click(combobox);
    const list = await screen.findByRole('listbox');
    const options = within(list).getAllByRole('option');

    expect(options.length).toBe(10);
    expect(combobox).toHaveAttribute('aria-expanded', 'true');
    expect(combobox).toHaveAttribute('aria-controls', 'country-listbox');
  });

  it('фильтрует по вводу "an" (регистр игнорируется)', async () => {
    render(<Controlled />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'an');

    const list = await screen.findByRole('listbox');
    const options = within(list).getAllByRole('option');

    options.forEach((li) => {
      expect((li.textContent || '').toLowerCase()).toContain('an');
    });
  });

  it('ArrowDown x2 затем Enter выбирают "Ukraine" и закрывают список', async () => {
    render(<Controlled />);
    const user = userEvent.setup();

    const cb = screen.getByRole('combobox');
    await user.click(cb);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(cb).toHaveValue('Ukraine');
  });

  it('Escape закрывает список и сохраняет набранный текст', async () => {
    render(<Controlled />);
    const user = userEvent.setup();

    const cb = screen.getByRole('combobox');
    await user.click(cb);
    await user.type(cb, 'fin');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(cb).toHaveValue('fin');
  });

  it('клик вне wrapRef закрывает список', async () => {
    render(
      <div>
        <Controlled />
        <div data-testid="outside">outside</div>
      </div>
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('combobox'));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();

    screen
      .getByTestId('outside')
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    await new Promise((r) => setTimeout(r, 0));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

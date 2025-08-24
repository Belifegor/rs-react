import { describe, it, expect, beforeEach } from 'vitest';
import { ensureRoot } from './ensureRoot';

describe('ensureRoot', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('возвращает #root, если он есть', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    expect(ensureRoot()).toBe(root);
  });

  it('кидает ошибку, если #root отсутствует', () => {
    expect(() => ensureRoot()).toThrowError(
      "Missing <div id='root'></div> in index.html"
    );
  });
});

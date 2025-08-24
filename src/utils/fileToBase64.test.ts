import { describe, it, expect } from 'vitest';
import { fileToBase64 } from './fileToBase64';

describe('fileToBase64', () => {
  it('конвертирует файл в base64 строку', async () => {
    const content = 'hello world';
    const file = new File([content], 'test.txt', { type: 'text/plain' });

    const result = await fileToBase64(file);

    expect(result.startsWith('data:text/plain;base64,')).toBe(true);
    expect(result.includes(btoa(content))).toBe(true);
  });
});

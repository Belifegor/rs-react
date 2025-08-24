import { describe, it, expect } from 'vitest';
import { imageFileSchema } from './imageFileSchema';

function createMockFile(name: string, sizeInBytes: number, type: string): File {
  const blob = new Blob([new ArrayBuffer(sizeInBytes)], { type });
  return new File([blob], name, { type });
}

describe('imageFileSchema', () => {
  it('валидный PNG до 5MB проходит', () => {
    const file = createMockFile('test.png', 1024 * 1024 * 4, 'image/png');
    const result = imageFileSchema.safeParse([file]);
    expect(result.success).toBe(true);
  });

  it('слишком большой JPEG (>5MB) отклоняется', () => {
    const file = createMockFile('big.jpg', 1024 * 1024 * 6, 'image/jpeg');
    const result = imageFileSchema.safeParse([file]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Only PNG/JPEG up to 5MB');
    }
  });

  it('неподдерживаемый тип GIF отклоняется', () => {
    const file = createMockFile('anim.gif', 1024, 'image/gif');
    const result = imageFileSchema.safeParse([file]);
    expect(result.success).toBe(false);
  });
});

import { z } from 'zod';

export const imageFileSchema = z
  .any()
  .optional()
  .refine((v) => {
    if (!v) return true;
    const file = (v as FileList)?.[0] ?? (v as File);
    if (!file) return true;
    const okType = ['image/png', 'image/jpeg'].includes(file.type);
    const okSize = file.size <= 5 * 1024 * 1024;
    return okType && okSize;
  }, 'Only PNG/JPEG up to 3MB');

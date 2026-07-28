import { beforeEach, describe, expect, it, vi } from 'vitest';

const findUnique = vi.fn();

vi.mock('../../lib/prisma', () => ({
  prisma: {
    classroom: {
      findUnique: (...args: unknown[]) => findUnique(...args),
    },
  },
}));

import {
  CODE_ALPHABET,
  CODE_LENGTH,
  createUniqueClassCode,
  generateClassCode,
  normalizeClassCode,
} from './classroom-code';

describe('generateClassCode', () => {
  it('returns a code of the expected length', () => {
    expect(generateClassCode()).toHaveLength(CODE_LENGTH);
  });

  it('only uses characters from the alphabet', () => {
    for (let i = 0; i < 1000; i++) {
      for (const char of generateClassCode()) {
        expect(CODE_ALPHABET).toContain(char);
      }
    }
  });

  it('never emits characters that are easy to misread', () => {
    const ambiguous = /[0O1IL]/;
    for (let i = 0; i < 1000; i++) {
      expect(generateClassCode()).not.toMatch(ambiguous);
    }
  });

  it('does not return the same code twice in a row', () => {
    const codes = new Set(Array.from({ length: 100 }, generateClassCode));
    expect(codes.size).toBeGreaterThan(90);
  });
});

describe('normalizeClassCode', () => {
  it('uppercases and trims what the student typed', () => {
    expect(normalizeClassCode('  k7f2qx ')).toBe('K7F2QX');
  });

  it('leaves an already-normalized code alone', () => {
    expect(normalizeClassCode('K7F2QX')).toBe('K7F2QX');
  });
});

describe('createUniqueClassCode', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns the first code when it is unused', async () => {
    findUnique.mockResolvedValue(null);

    const code = await createUniqueClassCode();

    expect(code).toHaveLength(CODE_LENGTH);
    expect(findUnique).toHaveBeenCalledTimes(1);
  });

  it('retries when a generated code is already taken', async () => {
    findUnique
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 })
      .mockResolvedValueOnce(null);

    const code = await createUniqueClassCode();

    expect(code).toHaveLength(CODE_LENGTH);
    expect(findUnique).toHaveBeenCalledTimes(3);
  });

  it('gives up after five collisions rather than looping forever', async () => {
    findUnique.mockResolvedValue({ id: 1 });

    await expect(createUniqueClassCode()).rejects.toThrow(/unique class code/);
    expect(findUnique).toHaveBeenCalledTimes(5);
  });
});

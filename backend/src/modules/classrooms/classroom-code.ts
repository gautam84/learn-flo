import { randomInt } from 'crypto';
import { prisma } from '../../lib/prisma';

// 0, O, 1, I and L are left out so a code survives being read aloud or copied off a whiteboard.
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 6;

const MAX_ATTEMPTS = 5;

/**
 * Generate a single class code. No uniqueness guarantee - use createUniqueClassCode
 * when the code is going to be persisted.
 */
export const generateClassCode = (): string => {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return code;
};

/**
 * Normalize a code as typed by a student, so a pasted "  k7f2qx " still matches.
 */
export const normalizeClassCode = (code: string): string => code.trim().toUpperCase();

/**
 * Generate a code that no classroom is using yet.
 */
export const createUniqueClassCode = async (): Promise<string> => {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = generateClassCode();
    const existing = await prisma.classroom.findUnique({ where: { code } });
    if (!existing) {
      return code;
    }
  }
  throw new Error(`Could not generate a unique class code after ${MAX_ATTEMPTS} attempts.`);
};

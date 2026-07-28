/**
 * Adds Classroom.code to an existing database without dropping data.
 *
 * This project has no Prisma migration history (prisma/migrations is gitignored), so
 * `prisma migrate dev` wants to reset the database. This script performs the same change
 * additively: add the column, backfill existing rows with generated codes, then lock it
 * down as NOT NULL + UNIQUE.
 *
 * Safe to re-run. Usage: npx ts-node prisma/add-classroom-code.ts
 */
import { prisma } from '../src/lib/prisma';
import { generateClassCode } from '../src/modules/classrooms/classroom-code';

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "Classroom" ADD COLUMN IF NOT EXISTS "code" TEXT;`);

  const rows = await prisma.$queryRawUnsafe<{ id: number }[]>(
    `SELECT "id" FROM "Classroom" WHERE "code" IS NULL;`
  );

  const taken = new Set(
    (
      await prisma.$queryRawUnsafe<{ code: string }[]>(
        `SELECT "code" FROM "Classroom" WHERE "code" IS NOT NULL;`
      )
    ).map((row) => row.code)
  );

  for (const { id } of rows) {
    let code = generateClassCode();
    while (taken.has(code)) {
      code = generateClassCode();
    }
    taken.add(code);
    await prisma.$executeRawUnsafe(`UPDATE "Classroom" SET "code" = $1 WHERE "id" = $2;`, code, id);
  }

  await prisma.$executeRawUnsafe(`ALTER TABLE "Classroom" ALTER COLUMN "code" SET NOT NULL;`);
  await prisma.$executeRawUnsafe(
    `CREATE UNIQUE INDEX IF NOT EXISTS "Classroom_code_key" ON "Classroom"("code");`
  );

  console.log(`Backfilled ${rows.length} classroom(s) with a class code.`);
}

main()
  .catch((error) => {
    console.error('add-classroom-code failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

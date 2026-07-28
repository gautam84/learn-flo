# Student enrollment by class code

**Date:** 2026-07-28
**Status:** Approved

## Problem

Students cannot join a classroom. The backend has a `POST /classrooms/enroll` handler that
takes a numeric `classroomId`, but nothing calls it, and nothing exposes un-enrolled
classrooms to students — `GET /classrooms/getClassrooms` returns only the classrooms a
student is already in. There is no frontend path to enrollment at all.

## Solution

Every classroom gets a short, unique, human-shareable code. The teacher reads the code off
their classroom list or classroom page; the student types it into a dialog and joins.

Scope is enrollment only. No unenroll, no teacher approval flow, no browsable directory of
classrooms.

## Data model

One new field on `Classroom`:

```prisma
model Classroom {
  id   Int    @id @default(autoincrement())
  name String
  code String @unique
  ...
}
```

**Code format:** 6 characters drawn from `ABCDEFGHJKMNPQRSTUVWXYZ23456789` (31 symbols).
`0`, `O`, `1`, `I` and `L` are excluded so a code survives being read aloud or copied off a
whiteboard. Generated with `crypto.randomInt` for uniform selection.

**Collisions:** 31^6 ≈ 887M combinations. Generation retries up to 5 times on a unique
constraint violation, then fails the request.

**Migration:** `prisma/migrations/` is gitignored, so this is applied locally with
`prisma migrate dev --create-only`, and the generated SQL is hand-edited to backfill
existing rows before the NOT NULL and unique index are added:

```sql
ALTER TABLE "Classroom" ADD COLUMN "code" TEXT;
UPDATE "Classroom" SET "code" = upper(substr(md5(random()::text), 1, 6)) WHERE "code" IS NULL;
ALTER TABLE "Classroom" ALTER COLUMN "code" SET NOT NULL;
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");
```

Backfilled codes may contain excluded characters. That is acceptable: they are valid
identifiers, and the unique index would fail loudly on the vanishingly unlikely collision.

## Backend

New module `backend/src/modules/classrooms/classroom-code.ts`:

- `generateClassCode(): string` — pure, returns one 6-character code.
- `createUniqueClassCode(): Promise<string>` — generates and checks against the database,
  retrying up to 5 times.

Changes in `classrooms.controller.ts`:

| Endpoint | Change |
| --- | --- |
| `POST /classrooms/create` | Assigns a generated code; returns it in the response. |
| `POST /classrooms/enroll` | Contract change: accepts `{ code: string }` instead of `{ classroomId: number }`. Returns `{ id, name }` of the joined classroom so the client can navigate to it. |
| `GET /classrooms/getClassrooms` | Includes `code` in the teacher branch only. |
| `GET /classrooms/:id` | New. Returns `{ id, name, createdAt, code? }`. `code` is present only when the requester is the creator. 403 when the requester is neither creator nor an enrolled student. |

The `enroll` contract is replaced rather than extended: the `{ classroomId }` shape has no
callers.

Codes are trimmed and uppercased server-side, so a student pasting `k7f2qx ` still joins.

**Error responses** (all `{ success: false, message }`):

| Case | Status | Message |
| --- | --- | --- |
| Malformed code | 400 | `Enter a valid 6-character class code.` |
| Requester is not a student | 403 | `Only students can enroll in classrooms.` |
| No classroom with that code | 404 | `No classroom found with that code.` |
| Already a member | 400 | `Already enrolled in this classroom.` |

`GET /classrooms/:id` is beyond strict enrollment, but the classroom detail page currently
fetches nothing about the classroom — it cannot display a code, or even a name, without it.

## Frontend

| File | Change |
| --- | --- |
| `lib/api/config.ts` | Add `ENROLL` and `GET_ONE` endpoints. |
| `lib/common/types.ts` | Add `code?: string` to `Classroom`. |
| `lib/api/classrooms.ts` | Add `enroll(code)` and `getClassroom(id)`. |
| `components/ui/dialog.tsx` | Add the shadcn dialog primitive. Only `alert-dialog` and `sheet` exist today; `@radix-ui/react-dialog` is already a dependency. |
| `components/classrooms/join-classroom-dialog.tsx` | New. Code input that uppercases as you type, Join disabled until 6 characters, inline API error, `onJoined(classroom)` callback. |
| `app/student/dashboard/classrooms/page.tsx` | "Join classroom" button in the header. On success: close, refetch, navigate to `/classroom/{id}`. |
| `app/teacher/dashboard/classrooms/page.tsx` | Code plus copy button on each card. The handler calls `preventDefault`/`stopPropagation` because cards are wrapped in `<Link>`. |
| `app/classroom/[id]/page.tsx` | Fetch the classroom, show its name as a heading, render the code chip when `code` is present — which by construction means the viewer is the teacher. |

Failures surface as inline text inside the dialog, where the user's attention already is.
Success uses a `sonner` toast (already a dependency). The copy button switches to a
"Copied" state for two seconds.

## Verification

`vitest` is added to the backend, which currently has no test runner, covering
`classroom-code.ts`:

- Generated codes are 6 characters.
- Generated codes never contain excluded characters `0O1IL`.
- 1000 generated codes are drawn from the permitted alphabet only.
- `createUniqueClassCode` retries when the first candidate already exists.
- `createUniqueClassCode` throws after 5 collisions.

Manual verification covers the rest: create a classroom as a teacher and confirm the code
appears in both places; join as a student with a valid code, a wrong code, a code for a
classroom already joined; confirm a teacher account is refused.

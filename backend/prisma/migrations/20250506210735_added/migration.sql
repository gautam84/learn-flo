-- CreateTable
CREATE TABLE "_EnrolledStudents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EnrolledStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EnrolledStudents_B_index" ON "_EnrolledStudents"("B");

-- AddForeignKey
ALTER TABLE "_EnrolledStudents" ADD CONSTRAINT "_EnrolledStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Classroom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrolledStudents" ADD CONSTRAINT "_EnrolledStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

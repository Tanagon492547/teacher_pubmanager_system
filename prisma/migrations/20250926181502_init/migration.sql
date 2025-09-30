/*
  Warnings:

  - You are about to drop the column `userTypeId` on the `Personal` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "user_name" TEXT,
    "user_fame" TEXT,
    "age" INTEGER,
    "userType" TEXT,
    "profile_image" TEXT,
    "email" TEXT,
    "number_phone" TEXT,
    "academic" TEXT,
    "faculty" TEXT,
    "department" TEXT,
    CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "user_fame", "user_name") SELECT "academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "user_fame", "user_name" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_userId_key" ON "Personal"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

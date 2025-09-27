/*
  Warnings:

  - You are about to drop the column `userType` on the `Personal` table. All the data in the column will be lost.
  - The primary key for the `UserType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `userTypeId` to the `UserType` table without a default value. This is not possible if the table is not empty.

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
    "profile_image" TEXT,
    "email" TEXT,
    "number_phone" TEXT,
    "academic" TEXT,
    "faculty" TEXT,
    "department" TEXT,
    "userTypeId" INTEGER,
    CONSTRAINT "Personal_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserType" ("userTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "user_fame", "user_name") SELECT "academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "user_fame", "user_name" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_userId_key" ON "Personal"("userId");
CREATE TABLE "new_UserType" (
    "id" INTEGER NOT NULL,
    "user_typename" TEXT NOT NULL,
    "userTypeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_UserType" ("id", "user_typename") SELECT "id", "user_typename" FROM "UserType";
DROP TABLE "UserType";
ALTER TABLE "new_UserType" RENAME TO "UserType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

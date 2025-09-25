/*
  Warnings:

  - You are about to drop the column `age` on the `Login` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Personal" ADD COLUMN "age" INTEGER;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Login" ("id", "userId") SELECT "id", "userId" FROM "Login";
DROP TABLE "Login";
ALTER TABLE "new_Login" RENAME TO "Login";
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the column `articleTypeId` on the `ArticleDB` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleDB" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_name" TEXT NOT NULL,
    "article_file" TEXT,
    "article_status" TEXT,
    "publish_status" TEXT,
    "published_year" INTEGER,
    "articleType" TEXT,
    "contributorId" INTEGER,
    "abstract" TEXT,
    CONSTRAINT "ArticleDB_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArticleDB" ("abstract", "article_file", "article_name", "article_status", "contributorId", "id", "publish_status", "published_year") SELECT "abstract", "article_file", "article_name", "article_status", "contributorId", "id", "publish_status", "published_year" FROM "ArticleDB";
DROP TABLE "ArticleDB";
ALTER TABLE "new_ArticleDB" RENAME TO "ArticleDB";
CREATE TABLE "new_Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "user_name" TEXT,
    "user_fame" TEXT,
    "age" INTEGER,
    "userTypeId" INTEGER NOT NULL,
    "profile_image" TEXT,
    "email" TEXT,
    "number_phone" TEXT,
    "academic" TEXT,
    "faculty" TEXT,
    "department" TEXT,
    CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Personal_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personal" ("academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "userTypeId", "user_fame", "user_name") SELECT "academic", "age", "department", "email", "faculty", "id", "number_phone", "profile_image", "userId", "userTypeId", "user_fame", "user_name" FROM "Personal";
DROP TABLE "Personal";
ALTER TABLE "new_Personal" RENAME TO "Personal";
CREATE UNIQUE INDEX "Personal_userId_key" ON "Personal"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

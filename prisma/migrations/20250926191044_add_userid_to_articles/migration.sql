/*
  Warnings:

  - Added the required column `userId` to the `ArticleDB` table without a default value. This is not possible if the table is not empty.

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
    "userId" INTEGER NOT NULL,
    CONSTRAINT "ArticleDB_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ArticleDB_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ArticleDB" ("abstract", "articleType", "article_file", "article_name", "article_status", "contributorId", "id", "publish_status", "published_year") SELECT "abstract", "articleType", "article_file", "article_name", "article_status", "contributorId", "id", "publish_status", "published_year" FROM "ArticleDB";
DROP TABLE "ArticleDB";
ALTER TABLE "new_ArticleDB" RENAME TO "ArticleDB";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

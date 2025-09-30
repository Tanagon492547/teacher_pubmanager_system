-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ArticleStatusHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "article_status" TEXT NOT NULL,
    "save_history" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewerId" INTEGER,
    "reviewerNote" TEXT,
    CONSTRAINT "ArticleStatusHistory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleDB" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArticleStatusHistory_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "UserAuthentication" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ArticleStatusHistory" ("articleId", "article_status", "id", "save_history") SELECT "articleId", "article_status", "id", "save_history" FROM "ArticleStatusHistory";
DROP TABLE "ArticleStatusHistory";
ALTER TABLE "new_ArticleStatusHistory" RENAME TO "ArticleStatusHistory";
CREATE INDEX "ArticleStatusHistory_articleId_idx" ON "ArticleStatusHistory"("articleId");
CREATE INDEX "ArticleStatusHistory_reviewerId_idx" ON "ArticleStatusHistory"("reviewerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

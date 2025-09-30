-- AlterTable
ALTER TABLE "ArticleDB" ADD COLUMN "published_date" DATETIME;

-- CreateTable
CREATE TABLE "CoAuthor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "academic_title" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    CONSTRAINT "CoAuthor_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleDB" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CoAuthor_articleId_idx" ON "CoAuthor"("articleId");

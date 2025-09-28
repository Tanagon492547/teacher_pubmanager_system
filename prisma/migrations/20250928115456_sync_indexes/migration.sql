-- CreateIndex
CREATE INDEX "ArticleDB_userId_idx" ON "ArticleDB"("userId");

-- CreateIndex
CREATE INDEX "ArticleDB_article_status_idx" ON "ArticleDB"("article_status");

-- CreateIndex
CREATE INDEX "ArticleDB_publish_status_idx" ON "ArticleDB"("publish_status");

-- CreateIndex
CREATE INDEX "ArticleDB_contributorId_idx" ON "ArticleDB"("contributorId");

-- CreateIndex
CREATE INDEX "ArticleDB_userId_article_status_idx" ON "ArticleDB"("userId", "article_status");

-- CreateIndex
CREATE INDEX "ArticleStatusHistory_articleId_idx" ON "ArticleStatusHistory"("articleId");

-- CreateIndex
CREATE INDEX "Category_articleId_idx" ON "Category"("articleId");

-- CreateIndex
CREATE INDEX "Contributor_contributor_name_idx" ON "Contributor"("contributor_name");

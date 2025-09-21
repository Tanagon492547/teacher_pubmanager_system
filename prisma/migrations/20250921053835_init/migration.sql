-- CreateTable
CREATE TABLE "UserAuthentication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "age" INTEGER,
    CONSTRAINT "Login_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Personal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_fame" TEXT,
    "userTypeId" INTEGER NOT NULL,
    CONSTRAINT "Personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAuthentication" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Personal_userTypeId_fkey" FOREIGN KEY ("userTypeId") REFERENCES "UserType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_typename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Contributor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contributor_name" TEXT NOT NULL,
    "academic_title" TEXT
);

-- CreateTable
CREATE TABLE "ArticleDB" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_name" TEXT NOT NULL,
    "article_file" TEXT,
    "article_status" TEXT,
    "publish_status" TEXT,
    "published_year" INTEGER,
    "articleTypeId" INTEGER,
    "contributorId" INTEGER,
    CONSTRAINT "ArticleDB_articleTypeId_fkey" FOREIGN KEY ("articleTypeId") REFERENCES "ArticleType" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ArticleDB_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "Contributor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleStatusHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "article_status" TEXT NOT NULL,
    "save_history" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArticleStatusHistory_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleDB" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "article_typename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "summary" TEXT,
    CONSTRAINT "Category_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "ArticleDB" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAuthentication_username_key" ON "UserAuthentication"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Login_userId_key" ON "Login"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_userId_key" ON "Personal"("userId");

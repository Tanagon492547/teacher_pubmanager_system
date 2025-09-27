BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "ArticleDB" (
	"id"	INTEGER NOT NULL,
	"article_name"	TEXT NOT NULL,
	"article_file"	TEXT,
	"article_status"	TEXT,
	"publish_status"	TEXT,
	"published_year"	INTEGER,
	"articleType"	TEXT,
	"contributorId"	INTEGER,
	"abstract"	TEXT,
	"userId"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "ArticleDB_contributorId_fkey" FOREIGN KEY("contributorId") REFERENCES "Contributor"("id") ON DELETE SET NULL ON UPDATE CASCADE,
	CONSTRAINT "ArticleDB_userId_fkey" FOREIGN KEY("userId") REFERENCES "UserAuthentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "ArticleStatusHistory" (
	"id"	INTEGER NOT NULL,
	"articleId"	INTEGER NOT NULL,
	"article_status"	TEXT NOT NULL,
	"save_history"	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "ArticleStatusHistory_articleId_fkey" FOREIGN KEY("articleId") REFERENCES "ArticleDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "ArticleType" (
	"id"	INTEGER NOT NULL,
	"article_typename"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Category" (
	"id"	INTEGER NOT NULL,
	"articleId"	INTEGER NOT NULL,
	"summary"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Category_articleId_fkey" FOREIGN KEY("articleId") REFERENCES "ArticleDB"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Contributor" (
	"id"	INTEGER NOT NULL,
	"contributor_name"	TEXT NOT NULL,
	"academic_title"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Login" (
	"id"	INTEGER NOT NULL,
	"userId"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Login_userId_fkey" FOREIGN KEY("userId") REFERENCES "UserAuthentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Personal" (
	"id"	INTEGER NOT NULL,
	"userId"	INTEGER NOT NULL,
	"user_name"	TEXT,
	"user_fame"	TEXT,
	"age"	INTEGER,
	"profile_image"	TEXT,
	"email"	TEXT,
	"number_phone"	TEXT,
	"academic"	TEXT,
	"faculty"	TEXT,
	"department"	TEXT,
	"userTypeId"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Personal_userId_fkey" FOREIGN KEY("userId") REFERENCES "UserAuthentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "User_Type_Id" FOREIGN KEY("userTypeId") REFERENCES "UserType"("userTypeId")
);
CREATE TABLE IF NOT EXISTS "UserAuthentication" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "UserType" (
	"id"	INTEGER NOT NULL,
	"user_typename"	TEXT NOT NULL,
	"userTypeId"	INTEGER NOT NULL,
	PRIMARY KEY("userTypeId")
);
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id"	TEXT NOT NULL,
	"checksum"	TEXT NOT NULL,
	"finished_at"	DATETIME,
	"migration_name"	TEXT NOT NULL,
	"logs"	TEXT,
	"rolled_back_at"	DATETIME,
	"started_at"	DATETIME NOT NULL DEFAULT current_timestamp,
	"applied_steps_count"	INTEGER UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY("id")
);
INSERT INTO "ArticleDB" VALUES (1,'Effects of A on B','/uploads/effects_ab.pdf','draft','private',2023,'Research Article',1,NULL,1);
INSERT INTO "ArticleDB" VALUES (2,'A review of C techniques','/uploads/review_c.pdf','submitted','public',2024,'Review Article',2,NULL,2);
INSERT INTO "ArticleDB" VALUES (3,'ความจริงมีหนึ่งเดียว',NULL,'pending','private',2025,NULL,3,'ในโลกที่เต็มไปด้วยข้อมูลข่าวสารที่สับสนวุ่นวาย...',3);
INSERT INTO "ArticleType" VALUES (1,'Research Article');
INSERT INTO "ArticleType" VALUES (2,'Review Article');
INSERT INTO "Contributor" VALUES (1,'Dr. Somchai','Assoc. Prof.');
INSERT INTO "Contributor" VALUES (2,'Dr. Malee','Asst. Prof.');
INSERT INTO "Contributor" VALUES (3,'ธนากร ชนะภักดี','ดร.');
INSERT INTO "Contributor" VALUES (4,'asffasf asfasfasff','asfasff');
INSERT INTO "Contributor" VALUES (5,'fasfas fasfasf','asfas');
INSERT INTO "Contributor" VALUES (6,'saf asf','asf');
INSERT INTO "Contributor" VALUES (7,'asfas asf','asfas');
INSERT INTO "Contributor" VALUES (8,'fdb fdb','dfbdf');
INSERT INTO "Contributor" VALUES (9,'asfasf asfasf','asfasf');
INSERT INTO "Contributor" VALUES (10,'asfasf asfasfsa','asff');
INSERT INTO "Contributor" VALUES (11,'sfasf asfasf','asfa');
INSERT INTO "Contributor" VALUES (12,'asfs fasf','asffas');
INSERT INTO "Login" VALUES (1,3);
INSERT INTO "Login" VALUES (2,2);
INSERT INTO "Login" VALUES (3,1);
INSERT INTO "Login" VALUES (4,4);
INSERT INTO "Personal" VALUES (1,1,'Somchai S','Assoc. Prof.',45,NULL,NULL,NULL,NULL,NULL,NULL,3);
INSERT INTO "Personal" VALUES (2,2,'Malee M','Asst. Prof.',38,NULL,NULL,NULL,NULL,NULL,NULL,1);
INSERT INTO "Personal" VALUES (3,3,'ธนากร ชนะภักดี','ดร.',45,NULL,'tanagon0402547@gmail.com','0862975391','ดร.','วิทยาศาสตร์','วิทยากาารคอมพิวเตอร์',3);
INSERT INTO "Personal" VALUES (4,4,'admin','888',325,NULL,NULL,NULL,NULL,NULL,NULL,2);
INSERT INTO "UserAuthentication" VALUES (1,'teacher1','password123');
INSERT INTO "UserAuthentication" VALUES (2,'staff1','staffpass');
INSERT INTO "UserAuthentication" VALUES (3,'tanagon','123456');
INSERT INTO "UserAuthentication" VALUES (4,'admin','123456');
INSERT INTO "UserType" VALUES (1,'Staff',1);
INSERT INTO "UserType" VALUES (2,'admin',2);
INSERT INTO "UserType" VALUES (3,'Teacher',3);
INSERT INTO "_prisma_migrations" VALUES ('ebe310f6-a398-402e-8175-ed9c87867fe0','7bfaf07503d8ba5f61d7035e6b021237480534b934acc0163198100fba6a1264',1758914039228,'20250921053835_init',NULL,NULL,1758914039213,1);
INSERT INTO "_prisma_migrations" VALUES ('ad5e7954-ee28-445c-abf7-090211c6aa33','ba91dda6e29d409891989df38b7c24fdfdbe861bd5d362d169600a57f48dbb91',1758914039240,'20250925130001_move_age_to_personal',NULL,NULL,1758914039229,1);
INSERT INTO "_prisma_migrations" VALUES ('0cb40b88-9842-451a-a77c-b37a9c886b08','fb61ec4090e5d76ad7a5b3863249603363cae1953ea6c5d6bd3298b358d82378',1758914039252,'20250926141610_init',NULL,NULL,1758914039241,1);
INSERT INTO "_prisma_migrations" VALUES ('7247bbf1-6daf-4a68-80ae-c27b78684a91','c13f4c850785f4d5e9589179fdd3e4c2e96056148a65c7a9a5f3910deff4f436',1758914039266,'20250926175622_init',NULL,NULL,1758914039253,1);
INSERT INTO "_prisma_migrations" VALUES ('f042871d-cdd2-4b51-a803-ad855b081441','834e2591d6323ef7bc724fd0f4f7bea2782e46cf85d1db28ebadec78220ad41c',1758914039276,'20250926181502_init',NULL,NULL,1758914039267,1);
INSERT INTO "_prisma_migrations" VALUES ('db913673-fc5b-4f6f-944d-3c44899edaba','914257621b204d9c89945da52a4f553138b8028eaee676dd4ae5492e2197d7b5',1758914039285,'20250926191044_add_userid_to_articles',NULL,NULL,1758914039277,1);
CREATE UNIQUE INDEX IF NOT EXISTS "Login_userId_key" ON "Login" (
	"userId"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Personal_userId_key" ON "Personal" (
	"userId"
);
CREATE UNIQUE INDEX IF NOT EXISTS "UserAuthentication_username_key" ON "UserAuthentication" (
	"username"
);
COMMIT;

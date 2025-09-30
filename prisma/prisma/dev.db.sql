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
	CONSTRAINT "Personal_userTypeId_fkey" FOREIGN KEY("userTypeId") REFERENCES "UserType"("userTypeId") ON DELETE NO ACTION ON UPDATE NO ACTION
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
	PRIMARY KEY("userTypeId" AUTOINCREMENT)
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
INSERT INTO "ArticleDB" VALUES (1,'Effects of A on B','/uploads/effects_ab.pdf','approved','private',2023,'Research Article',1,'แสงสุดท้ายของวันอาทิตย์กำลังจะลับขอบฟ้า แต่หน้าจอคอมพิวเตอร์ของเอเธนส์ยังคงสว่างไสว กองหนังสืออ้างอิงและไฟล์ PDF ที่ดาวน์โหลดมากว่าสิบไฟล์วางระเกะระกะ "เหลือเวลาอีกแค่สัปดาห์เดียว... แต่เรายังหาบทความหลักสำหรับโปรเจกต์ไม่ได้เลย" เอเธนส์พึมพำกับตัวเอง การค้นหาทั่วไปให้ผลลัพธ์ที่กว้างเกินไป เหมือนงมเข็มในมหาสมุทรข้อมูล จนกระทั่งเอเธนส์ได้เจอกับระบบค้นหาของมหาวิทยาลัยเวอร์ชันใหม่ หน้าตาของมันสะอาดและดูเป็นทางการ ไม่เหมือนระบบเก่าที่เคยใช้ ตรงหน้าคือ "ตัวกรองการค้นหาขั้นสูง" ที่ดูเหมือนจะเข้าใจความต้องการของเขา เอเธนส์เริ่มกรอก "คำค้นหา" ที่เฉพาะเจาะจงลงไปในช่องแรกที่มีไอคอนรูปแว่นขยายสวยงาม "AI and education technology" เขาพิมพ์ลงไปอย่างมีความหวัง ถัดมาคือ "ปีที่ตีพิมพ์" เอเธนส์จำได้ว่าอาจารย์แนะนำให้ใช้เปเปอร์ที่ไม่เก่าเกินไป เขาจึงใส่ช่วงปี "2022" ถึง "2025" ลงไปในช่อง "เริ่มต้น" และ "สิ้นสุด" "ประเภทผลงาน" คือตัวเลือกถัดไป เอเธนส์ต้องการงานวิจัยที่น่าเชื่อถือ เขาจึงเลือก "บทความวิจัย (Research)" จากในลิสต์ "ตำแหน่งทางวิชาการ" ก็เป็นตัวกรองที่น่าสนใจ เขาอยากได้งานของนักวิชาการที่มีชื่อเสียง เอเธนส์ลองเลือก "ศาสตราจารย์" ดู ด้านขวามี "ตัวกรองด่วน" ที่ดูน่าใช้ แต่เขายังอยากจะเจาะจงด้วยตัวเองก่อน ทุกอย่างดูพร้อมแล้ว... หัวใจของเขาเต้นแรงขึ้นเล็กน้อย เอเธนส์เลื่อนเมาส์ไปที่ปุ่มสีน้ำเงินเข้มทางด้านขวาล่างของฟอร์ม ปุ่มที่มีไอคอนแว่นขยายและคำว่า "ค้นหา" คลิก! หน้าเว็บไม่ได้รีเฟรชทั้งหมด แต่รายการผลลัพธ์ด้านล่างเปลี่ยนแปลงไปอย่างรวดเร็ว บทความสิบกว่ารายการปรากฏขึ้นมา แต่มีอยู่หนึ่งรายการที่ทำให้เอเธนส์ตาโต "The Synergy of AI Tutors and Modern Pedagogy" โดยศาสตราจารย์ท่านหนึ่งที่เขาติดตามอยู่ มันตรงกับหัวข้อโปรเจกต์ของเขาเป๊ะๆ! เขากดเข้าไปดูรายละเอียดทันที บทคัดย่อยืนยันว่านี่คือสิ่งที่เขาตามหามาตลอดหลายสัปดาห์ เอเธนส์กดดาวน์โหลดไฟล์ PDF นั้นมาเก็บไว้ด้วยความรู้สึกโล่งใจอย่างบอกไม่ถูก ฟอร์มค้นหาที่ออกแบบมาอย่างดีนี้ ไม่ใช่แค่เครื่องมือ... แต่มันคือสะพานที่เชื่อมโยงความพยายามของเขากับองค์ความรู้ที่ใช่ เอเธนส์ยิ้มออกมาได้เป็นครั้งแรกในรอบหลายชั่วโมง "เอาล่ะ... มาเริ่มเขียนโปรเจกต์ของเรากันเถอะ!"',1);
INSERT INTO "ArticleDB" VALUES (2,'A review of C techniques','/uploads/review_c.pdf','approved','public',2024,'Review Article',2,NULL,2);
INSERT INTO "ArticleDB" VALUES (3,'ความจริงมีหนึ่งเดียว',NULL,'pending','private',2025,'บทความวิจัย ระดับประเทศ',13,'ในโลกที่เต็มไปด้วยข้อมูลข่าวสารที่สับสนวุ่นวาย...',3);
INSERT INTO "ArticleDB" VALUES (4,'ผู้เข้าหาย','/file/pdf/4.pdf','approved','public',2025,'บทความประชุมวิชาการ ระดับสากล',14,'ผมเหนืื่อยยยยย
',3);
INSERT INTO "ArticleDB" VALUES (5,'asfasfasf',NULL,'pending','private',2025,'other',15,'784748787487478447',3);
INSERT INTO "ArticleStatusHistory" VALUES (1,2,'approved',1759062763394);
INSERT INTO "ArticleStatusHistory" VALUES (2,2,'approved',1759062768110);
INSERT INTO "ArticleStatusHistory" VALUES (3,2,'approved',1759062769356);
INSERT INTO "ArticleStatusHistory" VALUES (4,1,'approved',1759062808208);
INSERT INTO "ArticleStatusHistory" VALUES (5,1,'approved',1759062809228);
INSERT INTO "ArticleStatusHistory" VALUES (6,1,'approved',1759062810394);
INSERT INTO "ArticleStatusHistory" VALUES (7,1,'approved',1759062811151);
INSERT INTO "ArticleStatusHistory" VALUES (8,1,'approved',1759062813719);
INSERT INTO "ArticleStatusHistory" VALUES (9,3,'revision',1759062922801);
INSERT INTO "ArticleStatusHistory" VALUES (10,4,'approved',1759063252032);
INSERT INTO "ArticleType" VALUES (1,'Research Article');
INSERT INTO "ArticleType" VALUES (2,'Review Article');
INSERT INTO "Category" VALUES (1,3,'ประเภทไม่มี');
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
INSERT INTO "Contributor" VALUES (13,'null null',NULL);
INSERT INTO "Contributor" VALUES (14,'ธนา จริงโจ้','ดร');
INSERT INTO "Contributor" VALUES (15,'ธนากร asf','ดร.');
INSERT INTO "Login" VALUES (1,1);
INSERT INTO "Login" VALUES (2,2);
INSERT INTO "Login" VALUES (3,3);
INSERT INTO "Login" VALUES (4,4);
INSERT INTO "Personal" VALUES (1,1,'Somchai S','Assoc. Prof.',45,NULL,NULL,NULL,NULL,NULL,NULL,3);
INSERT INTO "Personal" VALUES (2,2,'Malee M','Asst. Prof.',38,NULL,NULL,NULL,NULL,NULL,NULL,1);
INSERT INTO "Personal" VALUES (3,3,'ธนากร ชนะภักดี','ดร.',45,NULL,'tanagon0402547@gmail.com','0862975391','ดร.','วิทยาศาสตร์','วิทยากาารคอมพิวเตอร์',3);
INSERT INTO "Personal" VALUES (4,4,'admin','888',325,NULL,NULL,NULL,NULL,NULL,NULL,2);
INSERT INTO "Personal" VALUES (5,5,'ธนากร ชนะภักดี์','นาย',39,NULL,NULL,NULL,NULL,NULL,NULL,1);
INSERT INTO "UserAuthentication" VALUES (1,'teacher1','password123');
INSERT INTO "UserAuthentication" VALUES (2,'staff1','staffpass');
INSERT INTO "UserAuthentication" VALUES (3,'tanagon','123456');
INSERT INTO "UserAuthentication" VALUES (4,'admin','123456');
INSERT INTO "UserAuthentication" VALUES (5,'6610210151','123456789');
INSERT INTO "UserType" VALUES (1,'Staff',1);
INSERT INTO "UserType" VALUES (2,'admin',2);
INSERT INTO "UserType" VALUES (3,'Teacher',3);
INSERT INTO "_prisma_migrations" VALUES ('5f89e540-fffe-495e-8afe-75b25ea95d55','7bfaf07503d8ba5f61d7035e6b021237480534b934acc0163198100fba6a1264',1759060496035,'20250921053835_init',NULL,NULL,1759060495918,1);
INSERT INTO "_prisma_migrations" VALUES ('2235eaa0-d7f8-4c44-979c-3138322707af','ba91dda6e29d409891989df38b7c24fdfdbe861bd5d362d169600a57f48dbb91',1759060496109,'20250925130001_move_age_to_personal',NULL,NULL,1759060496043,1);
INSERT INTO "_prisma_migrations" VALUES ('47ae9a25-a7c0-473f-a2a7-58aa3a9f74c4','8e0d4a82929d452522a21b74833a47861826fc731b4e0528907e0e6fd2aa3dee',1759060496189,'20250926141610_init',NULL,NULL,1759060496117,1);
INSERT INTO "_prisma_migrations" VALUES ('1198e95e-00fa-4e95-bd8f-6668f140cb82','5d8ed9f65d2e2cb2a5f139602da1b8973ac4bee50ceb80d3c5d4e7a58db6c9ac',1759060496286,'20250926175622_init',NULL,NULL,1759060496197,1);
INSERT INTO "_prisma_migrations" VALUES ('746a10b1-69fa-4478-a1b0-821caf378bed','17803741f4c7cf8e998dd704118a6365e2face98eb94c78bdc28bc1f68df3ddf',1759060496350,'20250926181502_init',NULL,NULL,1759060496294,1);
INSERT INTO "_prisma_migrations" VALUES ('4b2246a8-e85e-40de-8d30-d8ce3855eaa8','0f6e0529d5f9ec9cd616c72b56fa497648fd43fcfffd006306d015a0bad6d189',1759060496407,'20250926191044_add_userid_to_articles',NULL,NULL,1759060496358,1);
INSERT INTO "_prisma_migrations" VALUES ('81b28c3c-4f4e-4709-80f1-1226aff003f0','15bb46d52882ceb9a16277f8aba6e5040911bf5a9a4c838acd30a25ce92d9fe5',1759060496510,'20250927113646_init',NULL,NULL,1759060496416,1);
INSERT INTO "_prisma_migrations" VALUES ('0e5051f8-c843-43d8-aa0c-d3b7c5f1eae2','c6f8ddb1c50ab89376a16064c9ab9484c977e2d78286ece0008e6b2ccbcb7164',1759060496627,'20250928115456_sync_indexes',NULL,NULL,1759060496543,1);
CREATE INDEX IF NOT EXISTS "ArticleDB_article_status_idx" ON "ArticleDB" (
	"article_status"
);
CREATE INDEX IF NOT EXISTS "ArticleDB_contributorId_idx" ON "ArticleDB" (
	"contributorId"
);
CREATE INDEX IF NOT EXISTS "ArticleDB_publish_status_idx" ON "ArticleDB" (
	"publish_status"
);
CREATE INDEX IF NOT EXISTS "ArticleDB_userId_article_status_idx" ON "ArticleDB" (
	"userId",
	"article_status"
);
CREATE INDEX IF NOT EXISTS "ArticleDB_userId_idx" ON "ArticleDB" (
	"userId"
);
CREATE INDEX IF NOT EXISTS "ArticleStatusHistory_articleId_idx" ON "ArticleStatusHistory" (
	"articleId"
);
CREATE INDEX IF NOT EXISTS "Category_articleId_idx" ON "Category" (
	"articleId"
);
CREATE INDEX IF NOT EXISTS "Contributor_contributor_name_idx" ON "Contributor" (
	"contributor_name"
);
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

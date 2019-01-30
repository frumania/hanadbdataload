DROP TABLE "SCHEMA"."TABLE";
CREATE COLUMN TABLE "SCHEMA"."TABLE" (
"FIELD0" NVARCHAR(3),
"FIELD1" NVARCHAR(8),
"FIELD2" NVARCHAR(16),
"FIELD3" NVARCHAR(16),
"MEASURE1" INT,
"MEASURE2" INT)
PARTITION BY ROUNDROBIN PARTITIONS 15;
ALTER TABLE "SCHEMA"."TABLE" DISABLE AUTOMERGE;
IMPORT FROM '/sapmnt/log/test.ctl' WITH THREADS 120 BATCH 200000;
MERGE DELTA OF "SCHEMA"."TABLE";
ALTER TABLE "SCHEMA"."TABLE" ENABLE AUTOMERGE;
DROP TABLE "SCHEMA"."TABLE";
CREATE COLUMN TABLE "SCHEMA"."TABLE" (
"FIELD0" VARCHAR(3),
"FIELD1" VARCHAR(8),
"FIELD2" VARCHAR(16),
"FIELD3" VARCHAR(16),
"MEASURE1" INT,
"MEASURE2" INT)
PARTITION BY ROUNDROBIN PARTITIONS 20;
ALTER TABLE "SCHEMA"."TABLE" DISABLE AUTOMERGE;
IMPORT FROM '/sapmnt/log/test.ctl' WITH THREADS 25 BATCH 10000000;
MERGE DELTA OF "SCHEMA"."TABLE";
ALTER TABLE "SCHEMA"."TABLE" ENABLE AUTOMERGE;
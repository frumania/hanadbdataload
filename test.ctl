import data
into table SCHEMA.TABLE
from '/sapmnt/log/my.csv'
record delimited by '\n'
field delimited by ','
optionally enclosed by '"'
fail on invalid data
error log /sapmnt/log/error.log
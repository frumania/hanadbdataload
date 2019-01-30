import data
into table SCHEMA.TABLE
from '/sapmnt/log/my.csv'
record delimited by 'n'
field delimited by ','
optionally enclosed by '"'
error log /sapmnt/log/error.log
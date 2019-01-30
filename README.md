# Overview

This tool provides a performant technique to create large SAP HANA databases (> 1TBs) with random data for further benchmarking.
Inspired by https://blogs.saphana.com/2013/04/07/best-practices-for-sap-hana-data-loads/

## Prerequisites

* SAP HANA database installation
* OS access on HDB host via **root** as well as **hdbadm** user
* [NodeJS](https://nodejs.org) >= 8.X installed on HDB host (as **root**), e.g. for SLES see below
```bash
$ sudo -i
$ zypper addrepo http://download.opensuse.org/distribution/leap/15.0/repo/oss/ node10
$ zypper refresh
$ zypper install nodejs10
$ node -v
```
* Existing SAP HANA schema
* Existing SAP HANA user - to create tables and allow the execution of SQL commands
* Disabled CSV Import Path Filter: Configuration -> indexserver.ini -> import_export -> enable_csv_import_path_filter -> **false**. Can also be done via SQL:
> ALTER SYSTEM
> ALTER CONFIGURATION ('indexserver.ini', 'database')
> SET ('import_export', 'enable_csv_import_path_filter') = 'false'
> WITH RECONFIGURE;

## Installation

* Clone code repository or download & unpack to an arbitary folder on the HDB host
* Check execution rights and owner (should be **hdbadm** e.g. chown -R hanadbdataload hdbadm:sapsys)

Execute as **hdbadm**!

Deploy & Install via GIT
```bash
$ git clone https://github.com/frumania/hanadbdataload.git
$ cd hanadbdataload
$ npm config set @sap:registry https://npm.sap.com
$ npm install
```

## How to use

### Step 1) Prepare data (my.csv)

Execute as **hdbadm**!

Generate CSV
```bash
$ node generator.js
```

Optionally specify amount of rows, default 1M = 1000000
```bash
$ node generator.js --rows 100000000
```

#### Performance Info

1 M rows = 38 MB @ 4.4s => ca. 9 MB/s

### Step 1) Create tables and insert data

Execute as **hdbadm**!

Insert into HANA DB
```bash
$ node index.js --user <USER> --pw <PW>
```

Optional parameters
```bash
$ node index.js --user <USER> --pw <PW> -it 2 --schema MYSCHEMA --host localhost --port 30015 --db HDB --tablePrefix GEN
```

it = number of iterations / tables, default 1

#### Performance Info

1 M rows = ...

# License

[![Apache 2](https://img.shields.io/badge/license-Apache%202-blue.svg)](./LICENSE.txt)

Copyright (c) 2019 Marcel Törpe
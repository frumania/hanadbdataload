# Overview

This tool provides a performant technique to create large SAP HANA databases (> 1TBs) with random data for further benchmarking.
Inspired by https://blogs.saphana.com/2013/04/07/best-practices-for-sap-hana-data-loads/

## Prerequisites

* SAP HANA database installation
* OS access on HDB host via **root** as well as **hdbadm** user
* [NodeJS](https://nodejs.org) >= 8.X installed on HDB host (as **root**)
  * sudo -i
  * zypper addrepo http://download.opensuse.org/distribution/leap/15.0/repo/oss/ node10
  * zypper refresh
  * zypper install nodejs10
* node -v
* Existing SAP HANA schema
* SAP HANA User to create tables and execute SQL

Allow indexserver import/export ...

## Installation

* Download or clone code repository unpack to an arbitary folder on the HDB host
* Grant execution rights (e.g. chmod -R <folder> 755) and set owner to **hdbadm** (e.g. chown -R <folder> hdbadm:sapsys)

Execute as **hdbadm**!

Install
```bash
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

Generate CSV (optional specify amount of rows)
```bash
$ node generator.js --rows 100000000
```

#### Performance Info

1 M rows = 38 MB @ 4.4s => ca. 9 MB/s

### Step 1) Insert DATA

Execute as **hdbadm**!

Insert into HANA DB
```bash
$ node index.js
```

Insert into HANA DB with parameters
```bash
$ node index.js --schema DATALAKE ...
```

#### Performance Info

1 M rows = ...

# License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2019 Marcel Törpe
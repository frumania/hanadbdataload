const hanaClient = require("@sap/hana-client");
const fs = require("fs");
const path = require("path");
const argv = require('minimist')(process.argv.slice(2));

//Amount of Iterations
var iterations = typeof argv.it !== 'undefined' ? argv.it : 1;
//Connection Details
var schema = typeof argv.schema !== 'undefined' ? argv.schema : "DATA_LAKE";
var host = typeof argv.host !== 'undefined' ? argv.host : "3.122.200.232";
var port = typeof argv.port !== 'undefined' ? argv.port : "30215";
var user = typeof argv.user !== 'undefined' ? argv.user : "";
var password = typeof argv.pw !== 'undefined' ? argv.pw : "";
var db = typeof argv.db !== 'undefined' ? argv.db : "HDB";
//Misc
var table_prefix = typeof argv.tablePrefix !== 'undefined' ? argv.tablePrefix : "GEN";
var mountdir = path.join(__dirname+"/");
var simulateOnly = false;

if(user == "" || password == "")
{return console.error("[ERROR] User or password not specified, exiting!");}

console.debug(argv);

const connection = hanaClient.createConnection();

const connectionParams = {
    host : host,
    port : port,
    uid  : user,
    pwd  : password,
    databaseName : db
}

//Not used
function Test()
{
    var sql = `SELECT COUNT(*) FROM "DATA_LAKE"."GEN0"`;

    connection.exec(sql, (err, rows) => {

        if (err) {
            return console.error('SQL execute error:', err);
        }

        console.log("Results:", rows);
        console.log(`Query '${sql}' returned ${rows.length} items`);
    });
}

function WriteFile(file, body, resolve)
{
    fs.writeFile(file, body, function(err) {
        resolve("Stuff worked!");
        if(err) {
            return console.error(err);
        }
        console.log('[INFO] File <'+file+'> written successfully!');
    });
}

async function executeSQL()
{
    for (let index = 0; index < iterations; index++) {

        var hrstart = process.hrtime();

        var table = table_prefix+index;
        var file = table+".ctl";

        //PREPARE SQL
        var testsql = fs.readFileSync('test.sql').toString();
        testsql = testsql.replace(/\"SCHEMA\"/g, '"'+schema+'"');
        testsql = testsql.replace(/\"TABLE\"/g, '"'+table+'"');
        testsql = testsql.replace(/\/sapmnt\/log\/test.ctl/g, mountdir+file);

        //EXECUTE SQL
        var sqlstatements = testsql.split(";");

        for (let kindex = 0; kindex < sqlstatements.length; kindex++)
        {
            var sql = sqlstatements[kindex];
            sql = sql.trim();

            if(sql.charAt(0) != "#" && sql != "")
            {
                console.log("[INFO] Executing... '"+sql+";'");

                if(!simulateOnly)
                {
                    await new Promise(function(resolve, reject) 
                    {
                        connection.exec(sql, (err, rows) => {

                            resolve();

                            if (err) {
                                return console.error('[ERROR] SQL execute error:', err);
                            }
                            
                            if(rows)
                            {
                                console.log("[INFO] Results:", rows);
                                console.log(`[INFO] Query '${sql}' returned ${rows.length} items`);
                            }
                        });
                    });
                }
            }

            if(kindex == sqlstatements.length-1)
            Test();
        }

        var hrend = process.hrtime(hrstart)
        console.info('[INFO] Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
    }
}

connection.connect(connectionParams, (err) => {
    if (err && !simulateOnly) {
        return console.error("[ERROR] Connection error", err);
    }

    //CREATE CTL FILE
    var mypromises = [];
    for (let index = 0; index < iterations; index++) {
        
        var table = table_prefix+index;

        //PREPARE & CREATE CTL
        var testctl = fs.readFileSync('test.ctl').toString();
        testctl = testctl.replace(/SCHEMA/g, schema);
        testctl = testctl.replace(/TABLE/g, table);
        testctl = testctl.replace(/\/sapmnt\/log\//g, mountdir);
        var file = table+".ctl";
        var mypromise = new Promise(function(resolve, reject) {
            WriteFile(file, testctl, resolve);
        });
        mypromises.push(mypromise);
    }

    //WAIT UNTIL .CTL FILES WRITTEN
    Promise.all(mypromises).then(function(values) {
        console.log("[INFO] All .ctl files written");
        executeSQL();
    });

    //connection.disconnect();
});
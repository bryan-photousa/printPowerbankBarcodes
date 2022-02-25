// use: node printFile.js [filePath printerName]
//read composite filename and send to printer

//TODO: get barcode composite from NAS 

var printer = require("../lib"),
    filename = process.argv[2] || __filename;  //Feed filename here

console.log('platform:', process.platform);
console.log('try to print file: ' + filename);

if( process.platform != 'win32') {
  printer.printFile({filename:filename,
    printer: process.env[3], // printer name, if missing then will print to default printer
    success:function(jobID){
      console.log("sent to printer with ID: "+jobID);
      //TODO: parse filename and call change_order_id_to_printed
    },
    error:function(err){
      console.log(err);
    }
  });
} else {
  // not yet implemented, use printDirect and text
  var fs = require('fs');
  printer.printDirect({data:fs.readFileSync(filename),
    printer: process.env[3], // printer name, if missing then will print to default printer
    success:function(jobID){
      console.log("sent to printer with ID: "+jobID);
    },
    error:function(err){
      console.log(err);
    }
  });
}

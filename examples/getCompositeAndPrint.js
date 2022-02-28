// use: node printFile.js [filePath printerName]
//read composite filename and send to printer
var fs = require('fs');
var fsExtra = require('fs-extra');
const { get } = require('http');
var printer = require("../lib");
PrintedService = require('../services/printed.service');

// let filename = process.argv[0];
// console.log(filename);
// let splitFilename = filename.split('.')[0].split('-');
// let compositeId = splitFilename[0];
// let compositeDate = splitFilename[1];
//TODO: get barcode composite from NAS

baseNasPath = '/Volumes/nas/48/Zazzle/auto_print/openprint';
let nas103Path = `${baseNasPath}/batch_downloaded_PowerBank_103`;
let nas104Path = `${baseNasPath}/batch_downloaded_PowerBank_104`;

let nas103Printed = `${baseNasPath}/batch_printed_PowerBank_103/batch_printed_`;
let nas104Printed = `${baseNasPath}/batch_printed_PowerBank_104/batch_printed_`;

getDirectoriesFromPath(nas103Path).then(response => {
  console.log("RESPONSE");
  console.log(response);
  findBarcodeComposites(response, nas103Path, nas103Printed);
}).catch(err => {
  console.log(err);
});
//console.log(directories103);
//let barcodeRes1 = findBarcodeComposites(directories103, nas103Path);
//console.log(barcodeRes1);

getDirectoriesFromPath(nas104Path).then(response => {
  console.log("RESPONSE");
  console.log(response);
  findBarcodeComposites(response, nas104Path, nas104Printed);
}).catch(err => {
  console.log(err);
});
//console.log(directories104);
//let barcodeRes2 = findBarcodeComposites(directories104, nas104Path);
//console.log(barcodeRes2);

async function printFile(filePath, filename, newFilePath) {
  console.log('platform:', process.platform);
  console.log('try to print file: ' + filePath);
  console.log(filename);
  if( process.platform != 'win32') {
    printer.printFile({filename: filePath,
      printer: process.env['PRINTER'], // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log("sent to printer with ID: " + jobID);
        console.log(filename);
        let splitFilename = filename.split('_');
        let itemIds = splitFilename[0].split('-');
        console.log("ITEM IDS");
        console.log(itemIds);
        for (let i=0; i < itemIds.length; i++) {
          let itemId = parseInt(itemIds[i])
          let data = {
            "order_item_list_id": itemId
          }
          PrintedService.setToPrinted(data).then(response => {
            console.log("RESPONSE FROM OP");
            console.log(response);
            if (i == (itemIds.length - 1)) {
              let splitNewPath = newFilePath.split('/');
              let lastItem = splitNewPath.pop();
              //let secondItem = splitNewPath.pop();
              console.log("POPS");
              console.log(lastItem);
              //console.log(secondItem);
              splitNewPath = splitNewPath.join("/");
              console.log("PATH TO MAKE");
              console.log(splitNewPath);
              if (!fs.existsSync(splitNewPath)) {
                fs.mkdirSync(splitNewPath, { recursive: true });
              }
              fsExtra.move(filePath, newFilePath, (err) => {
                if (err) {
                  throw err;
                }
              });
              console.log("Moved Files");
            }
          }).catch(err => {
            console.log(err);
          })
        }
      },
      error:function(err){
        console.log(err);
      }
    });
  } else {
    // not yet implemented, use printDirect and text
    
    printer.printDirect({data:fs.readFileSync(filePath),
      printer: process.env['PRINTER'], // printer name, if missing then will print to default printer
      success:function(jobID){
        console.log("sent to printer with ID: "+jobID);
      },
      error:function(err){
        console.log(err);
      }
    });
  }
  //return true;
}

async function getDirectoriesFromPath(path) {
  let directories = fs.readdirSync(path).filter(function (file) {
    return fs.statSync(`${path}/${file}`).isDirectory();
  })
  return directories;
}

async function findBarcodeComposites(dirs, basePath, endPath) {
  let barcodeBase = 'barcodes_';
  console.log("DIRS");
  console.log(dirs)
  for (let i=0; i < dirs.length; i++) {
  //for (let i=0; i < 1; i++) {
    console.log(dirs);
    let currDir = dirs[i];
    let splitDir = currDir.split('_');
    let compDate = splitDir[2];
    let barcodePath = `${basePath}/${currDir}/${barcodeBase}${compDate}`;
    let newBarcodePath = `${endPath}${compDate}/${barcodeBase}${compDate}`
    console.log("BARCODE PATH");
    console.log(barcodePath);
    let barcodeFiles = fs.readdirSync(barcodePath);
    console.log("BARCODE FILES");
    console.log(barcodeFiles);
    for (let j=0; j < barcodeFiles.length; j++) {
      let barcodeFile = barcodeFiles[j];
      let splitBarcodeFile = barcodeFile.split('.');
      let extension = splitBarcodeFile[1];
      console.log(extension);
      if ((extension == '.jpg') || (extension == '.jpeg')) {
        let finalPath = `${barcodePath}/${barcodeFile}`;
        let newfinalPath = `${newBarcodePath}/${barcodeFile}`;
        let res = await printFile(finalPath, barcodeFile, newfinalPath);
      } 
      
    }
  }
  //return true;
}

// function moveAndRemove(oldFilePath, newFilePath) {
//   fs.rename(oldFilePath, newFilePath);
// }
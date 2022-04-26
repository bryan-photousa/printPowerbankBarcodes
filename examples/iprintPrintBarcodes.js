var fs = require('fs');
var fsExtra = require('fs-extra');
const { get } = require('http');
var printer = require("../lib");
PrintedService = require('../services/printed.service');
const { exec } = require("child_process");
const log = require("simple-node-logger");

const opts = {
  logFilePath:'C:\\Users\\camillatan\\printPowerbankBarcodes\\examples\\logs\\printBarcodes.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
}

const logger = log.createSimpleLogger( opts );
logger.info("Printing Barcodes IP");

let homePath = `${__dirname}`;
let regex = /[.]pdf$/;
fs.readdirSync(`${homePath}`).filter(f => regex.test(f)).forEach(f => fs.unlinkSync(homePath + '/' + f));
logger.info("Removed Old Pdf Files From Local Directory");

baseNasPath = '\\\\10.100.50.31\\nas\\48\\Zazzle\\auto_print\\iprint';

let nas103Path = `${baseNasPath}\\batch_downloaded_PowerBank_103`;
let nas104Path = `${baseNasPath}\\batch_downloaded_PowerBank_104`;

let nas103Printed = `${baseNasPath}\\batch_printed_PowerBank_103\\batch_printed_`;
let nas104Printed = `${baseNasPath}\\batch_printed_PowerBank_104\\batch_printed_`;

getDirectoriesFromPath(nas103Path).then(response => {
  console.log("RESPONSE");
  console.log(response);
  findBarcodeComposites(response, nas103Path, nas103Printed);
}).catch(err => {
  console.log(err);
  logger.error(err);
});


getDirectoriesFromPath(nas104Path).then(response => {
  console.log("RESPONSE");
  console.log(response);
  findBarcodeComposites(response, nas104Path, nas104Printed);
}).catch(err => {
  console.log(err);
  logger.error(err);
});


async function printFile(filePath, filename, newFilePath) {
  console.log('platform:', process.platform);
  console.log('try to print file: ' + filePath);
  logger.info('try to print file: ' + filePath)
  console.log(filename);
  if (process.platform != 'win32') {
    printer.printFile({
      filename: filePath,
      printer: process.env['PRINTER'], // printer name, if missing then will print to default printer
      success: function (jobID) {
        console.log("sent to printer with ID: " + jobID);
        console.log(filename);
        let splitFilename = filename.split('_');
        let itemIds = splitFilename[0].split('-');
        console.log("ITEM IDS");
        console.log(itemIds);
        for (let i = 0; i < itemIds.length; i++) {
          let itemId = parseInt(itemIds[i])
          let data = {
            "order_item_list_id": itemId
          }
          PrintedService.iprintSetToPrinted(data).then(response => {
            console.log("RESPONSE FROM OP");
            console.log(response);
            if (i == (itemIds.length - 1)) {
              let splitNewPath = newFilePath.split('\\');
              let lastItem = splitNewPath.pop();
              //let secondItem = splitNewPath.pop();
              console.log("POPS");
              console.log(lastItem);
              //console.log(secondItem);
              splitNewPath = splitNewPath.join("\\");
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
      error: function (err) {
        console.log(err);
      }
    });
  } else {
    var spawn = require("child_process").spawn, child;


    let splitFilePath = filePath.split("\\");
    let tempFilename = splitFilePath[splitFilePath.length - 1];
    let noExtFilename = tempFilename.split(".")[0];

    let baseOutput = `${__dirname}\\${noExtFilename}.pdf`
    console.log(baseOutput);
    logger.info(baseOutput);

    let cmd = "&'C:\\Program Files\\ImageMagick-7.1.0-Q16-HDRI\\convert.exe'" + " '" + filePath + "' '" + baseOutput + "'" + " | Invoke-Expression"

    let printCmd = "Start-Process powershell.exe " + `-FilePath ${baseOutput} ` + " -Verb Print"
    console.log('printCmd: ' + JSON.stringify(printCmd))

    exec(`${cmd}`, { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {

      if (error) {
        console.log('error: ' + JSON.stringify(error))
        logger.error(error);
      }
      logger.info("PDF's Created");

      exec(`${printCmd}`,{ 'shell': 'powershell.exe' }, (error, stdout, stderr) => {

        if (error) {
          console.log('error: ' + JSON.stringify(error))
          logger.error(error);
        } else {
          logger.info("Barcode PDF Printed")
          console.log(filename);
          logger.info(filename)
          //let splitFilename = filename.split('_');
          //let itemIds = splitFilename[0].split('-');
          //console.log("ITEM IDS");
          //console.log(itemIds);
        //   for (let i = 0; i < itemIds.length; i++) {
        //     let itemId = parseInt(itemIds[i])
        //     let data = {
        //       "order_item_list_id": itemId
        //     }
            //logger.info(`Setting to Printed Status: ${itemId}`)
            // PrintedService.setToPrinted(data).then(response => {
            //   console.log("RESPONSE FROM OP");
            //   console.log(response);
            //   logger.info(`Response from OP: ${response}`);
            //   if (i == (itemIds.length - 1)) {
            //     let splitNewPath = newFilePath.split('\\');
            //     let lastItem = splitNewPath.pop();
            //     //let secondItem = splitNewPath.pop();
            //     console.log("POPS");
            //     console.log(lastItem);
            //     //console.log(secondItem);
            //     splitNewPath = splitNewPath.join("\\");
            //     console.log("PATH TO MAKE");
            //     console.log(splitNewPath);
            //     if (!fs.existsSync(splitNewPath)) {
            //       fs.mkdirSync(splitNewPath, { recursive: true });
            //     }
            //     fsExtra.move(filePath, newFilePath, (err) => {
            //       if (err) {
            //         throw err;
            //       }
            //     });
            //     console.log("Moved Files");
            //     logger.info("Moved Files");
            //   }
            // }).catch(err => {
            //   console.log(err);
            //   logger.error(err);
            // })
          //}
        }
        // do whatever with stdout
        console.log(stdout)
        console.log(stderr)
        console.log('aindie callback')
      })

    })



    var spawn = require("child_process").spawn, child;
  }

}

async function getDirectoriesFromPath(path) {
  let directories = fs.readdirSync(path).filter(function (file) {
    return fs.statSync(`${path}\\${file}`).isDirectory();
  })
  return directories;
}

async function findBarcodeComposites(dirs, basePath, endPath) {
  let barcodeBase = 'barcodes_';
  console.log("DIRS");
  console.log(dirs)
  for (let i = 0; i < dirs.length; i++) {
    //for (let i=0; i < 1; i++) {
    console.log(dirs);
    let currDir = dirs[i];
    let splitDir = currDir.split('_');
    let compDate = splitDir[2];
    let barcodePath = `${basePath}\\${currDir}\\${barcodeBase}${compDate}`;
    let newBarcodePath = `${endPath}${compDate}\\${barcodeBase}${compDate}`
    console.log("BARCODE PATH");
    console.log(barcodePath);
    let barcodeFiles = fs.readdirSync(barcodePath);
    console.log("BARCODE FILES");
    console.log(barcodeFiles);
    if (barcodeFiles) {
      for (let j = 0; j < barcodeFiles.length; j++) {
        let barcodeFile = barcodeFiles[j];
        let splitBarcodeFile = barcodeFile.split('.');
        let extension = splitBarcodeFile[1];
        console.log(extension);
        if ((extension == 'jpg') || (extension == 'jpeg')) {
          let finalPath = `${barcodePath}\\${barcodeFile}`;
          let newfinalPath = `${newBarcodePath}\\${barcodeFile}`;
          let res = await printFile(finalPath, barcodeFile, newfinalPath);
        }

      }
    }
  }
  //return true;
}
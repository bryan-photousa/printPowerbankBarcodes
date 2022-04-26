var fs = require('fs');
var fsExtra = require('fs-extra');
PrintedService = require('../services/printed.service');
const log = require("simple-node-logger");

const opts = {
  logFilePath:'C:\\Users\\camillatan\\printPowerbankBarcodes\\examples\\logs\\printBarcodes.log',
  timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
}

const logger = log.createSimpleLogger( opts );
logger.info("Setting Printed Items to Printed Status OP");

baseNasPath = '\\\\10.100.50.31\\nas\\48\\Zazzle\\auto_print\\openprint';

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

async function getDirectoriesFromPath(path) {
  let directories = fs.readdirSync(path).filter(function (file) {
    return fs.statSync(`${path}\\${file}`).isDirectory();
  })
  return directories;
}

async function findBarcodeComposites(dirs, basePath, endPath) {
  let barcodeBase = 'barcodes_';
  //let artworkBase = 'artworks_';
  let artworkEnd;
  console.log("DIRS");
  console.log(dirs)
  for (let i = 0; i < dirs.length; i++) {
    console.log(dirs);
    let currDir = dirs[i];
    try {
      let currDirContent = fs.readdirSync(`${basePath}\\${currDir}`);
      for (let l=0; l < currDirContent.length; l++) {
        let possFolder = currDirContent[l];
        console.log(possFolder);
        if (possFolder.includes('artworks')) {
          artworkEnd = possFolder;
        }
      }
      console.log(artworkEnd)
    } catch (err) {
      console.log(`LINE 67: ${err}`);
    }
    
    
    let splitDir = currDir.split('_');
    let compDate = splitDir[2];
    let barcodePath = `${basePath}\\${currDir}\\${barcodeBase}${compDate}`;
    let newBarcodePath = `${endPath}${compDate}\\${barcodeBase}${compDate}`;
    let artworkPath = `${basePath}\\${currDir}\\${artworkEnd}`;
    let newArtworkPath = `${endPath}${compDate}\\${artworkEnd}`;
    console.log("BARCODE PATH");
    console.log(barcodePath);
    let barcodeFiles = fs.readdirSync(barcodePath);
    console.log("BARCODE FILES");
    console.log(barcodeFiles);
    let artworkFiles = fs.readdirSync(artworkPath);
    if (artworkFiles) {
      for (let k=0; k < artworkFiles.length; k++) {
        let artworkFile = artworkFiles[k];
        let splitArtworkFile = artworkFile.split('.');
        let artExtension = splitArtworkFile[1];
        console.log(artExtension);
        if (artExtension == 'tiff') {
          artworkPath = `${artworkPath}\\${artworkFile}`;
          newArtworkPath = `${newArtworkPath}\\${artworkFile}`
        }
      }
    }
    if (barcodeFiles) {
      for (let j = 0; j < barcodeFiles.length; j++) {
        let barcodeFile = barcodeFiles[j];
        let splitBarcodeFile = barcodeFile.split('.');
        let extension = splitBarcodeFile[1];
        console.log(extension);
        if ((extension == 'jpg') || (extension == 'jpeg')) {
          let finalPath = `${barcodePath}\\${barcodeFile}`;
          let newfinalPath = `${newBarcodePath}\\${barcodeFile}`;
          console.log(artworkPath);
          console.log(newArtworkPath);
          let res = await setToPrint(finalPath, barcodeFile, newfinalPath, artworkPath, newArtworkPath);
        }
  
      }
    }
  }
}

async function setToPrint(filePath, filename, newFilePath, artworkPath, newArtworkPath) {
  console.log('platform:', process.platform);
  console.log('try to print file: ' + filePath);
  logger.info('try to print file: ' + filePath);
  console.log("Moving Artwork")
  console.log(artworkPath);
  console.log(newArtworkPath);
  console.log(filename);
  if (process.platform != 'win32') {
    logger.info(process.platform);
  } else {
    logger.info(process.platform);
    let splitFilename = filename.split('_');
    let itemIds = splitFilename[0].split('-');
    console.log("ITEM IDS");
    console.log(itemIds);
    for (let i = 0; i < itemIds.length; i++) {
      let itemId = parseInt(itemIds[i])
      let data = {
        "order_item_list_id": itemId
      }
      logger.info(`Setting to Printed Status: ${itemId}`);

      // FOR TESTING
      // ---------------------------------------------------
      // if (i == (itemIds.length - 1)) {
      //   let splitArtworkPath = newArtworkPath.split('\\');
      //   let lastArtworkItem = splitArtworkPath.pop();
      //   console.log(lastArtworkItem);
      //   splitArtworkPath = splitArtworkPath.join("\\");
      //   if (!fs.existsSync(splitArtworkPath)) {
      //     fs.mkdirSync(splitArtworkPath, { recursive: true });
      //   }
      //   fsExtra.move(artworkPath, newArtworkPath, (err) => {
      //     if (err) {
      //       throw err;
      //     }
      //     //logger.info("Moved Artwork Files");
      //   });
      //   logger.info("Moved Artwork Files");
      // }
      // -----------------------------------------------------------------
      
      PrintedService.setToPrinted(data).then(response => {
        console.log("RESPONSE FROM OP");
        console.log(response);
        logger.info(`Response from OP: ${response}`);
        if (i == (itemIds.length - 1)) {
          let splitNewPath = newFilePath.split('\\');
          let lastItem = splitNewPath.pop();
          let splitArtworkPath = newArtworkPath.split('\\');
          let lastArtworkItem = splitArtworkPath.pop();
          //let secondItem = splitNewPath.pop();
          console.log("POPS");
          console.log(lastItem);
          console.log(lastArtworkItem);
          //console.log(secondItem);
          splitNewPath = splitNewPath.join("\\");
          splitArtworkPath = splitArtworkPath.join("\\");
          console.log("PATH TO MAKE");
          console.log(splitNewPath);

          if (!fs.existsSync(splitNewPath)) {
            fs.mkdirSync(splitNewPath, { recursive: true });
          }
          fsExtra.move(filePath, newFilePath, (err) => {
            if (err) {
              throw err;
            }
            logger.info("Moved Barcode Files OP");
          });

          if (!fs.existsSync(splitArtworkPath)) {
            fs.mkdirSync(splitArtworkPath, { recursive: true });
          }
          fsExtra.move(artworkPath, newArtworkPath, (err) => {
            if (err) {
              throw err;
            }
            logger.info("Moved Artwork Files OP");
          })
          console.log("Moved Files OP");
          logger.info("Moved Files OP");
        }
      }).catch(err => {
        console.log(err);
        logger.error(err);
      })
    }
  }
}

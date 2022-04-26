//var defaultRulerUnits = preferences.rulerUnits;
//preferences.rulerUnits = Units.PIXELS;

//Traverse Nas Folder

var baseNasPath103 = 'S:\\48\\Zazzle\\auto_print\\openprint\\batch_downloaded_PowerBank_103';
// var baseNasPath103 = '\\\\10.100.50.31\\nas\\48\\Zazzle\\autoprint\\openprint\\batch_downloaded_PowerBank_103';
var baseNasPath104 = 'S:\\48\\Zazzle\\auto_print\\openprint\\batch_downloaded_PowerBank_104';

var iprintNasPath103 = 'S:\\48\\Zazzle\\auto_print\\iprint\\batch_downloaded_PowerBank_103';
var iprintNasPath104 = 'S:\\48\\Zazzle\\auto_print\\iprint\\batch_downloaded_PowerBank_104';

traverse103(baseNasPath103);
traverse104(baseNasPath104);

traverse103(iprintNasPath103);
traverse104(iprintNasPath104);

function traverse103(basePath) {
  var mainFolder = Folder(basePath);
  // if (mainFolder.exists) {
    var subFolders = mainFolder.getFiles();
    for (var i=0; i < subFolders.length; i++) {
      var compFolder = subFolders[i];
      // console.log("FIRST FOLDER");
      // console.log(decodeURI(files[0].name));
      if (compFolder instanceof Folder) {
        var lvlTwoSubFolders = compFolder.getFiles();
        for (var j=0; j < lvlTwoSubFolders.length; j++) {
          var currFolder = lvlTwoSubFolders[j];
          // alert("BEFORE Barcodes")
          if (decodeURI(currFolder.name).indexOf('artworks') >= 0) {
            var files = currFolder.getFiles();
            // console.log("FILENAME");
            if (files.length > 0) {
              for (var k=0; k < files.length; k++) {
                var tiffFileName = decodeURI(files[k].name);
                //alert(tiffFileName);
                var splitName = tiffFileName.split('.');
                var extension = splitName[1];
                if (extension == 'tiff') {
                  var realSplitName = splitName[0].split('_');
                  var quantity = parseInt(realSplitName[realSplitName.length - 1]);
                  // console.log(quantity);
                  //alert(quantity)
                  // console.log(decodeURI(files[0].name));
                  var document = app.open(files[k]);
                  var currChannels = document.channels;
                  var spotExists = false;
                  for (var l=0; l < currChannels.length; l++) {
                    var thisChannel = currChannels[l];
                    var channelName = thisChannel.name;
                    if (channelName == 'Spot_Color1') {
                      spotExists = true;
                    }
                  }
                  if (!spotExists) {
                    if (1 <= quantity) {
                      oneSelect103();
                    }
                    if (2 <= quantity) {
                      twoSelect103();
                    }
                    if (3 <= quantity) {
                      threeSelect103();
                    }
                    if (4 <= quantity) {
                      fourSelect103();
                    }
                    if (5 <= quantity) {
                      fiveSelect103();
                    }
                    if (6 <= quantity) {
                      sixSelect103();
                    } 
                    saveSpotColor();
                    document.save();
                  }
                  
                  document.close();
                }
                
              }
              
            }
          }
        }
      }
    }
  return true;
}

function traverse104(basePath) {
  var mainFolder = Folder(basePath);
  // if (mainFolder.exists) {
    var subFolders = mainFolder.getFiles();
    for (var i=0; i < subFolders.length; i++) {
      var compFolder = subFolders[i];
      if (compFolder instanceof Folder) {
        var lvlTwoSubFolders = compFolder.getFiles();
        for (var j=0; j < lvlTwoSubFolders.length; j++) {
          var currFolder = lvlTwoSubFolders[j];
          // alert("BEFORE Barcodes")
          if (decodeURI(currFolder.name).indexOf('artworks') >= 0) {
            var files = currFolder.getFiles();
            if (files.length > 0) {
              for (var k=0; k < files.length; k++) {
                var tiffFileName = decodeURI(files[k].name);
                var splitName = tiffFileName.split('.');
                var extension = splitName[1];
                if (extension == 'tiff') {
                  var realSplitName = splitName[0].split('_');
                  var quantity = parseInt(realSplitName[realSplitName.length - 1]);
                  //alert(quantity)
                  var document = app.open(files[k]);
                  var currChannels = document.channels;
                  var spotExists = false;
                  for (var l=0; l < currChannels.length; l++) {
                    var thisChannel = currChannels[l];
                    var channelName = thisChannel.name;
                    if (channelName === 'Spot_Color1') {
                      spotExists = true;
                    }
                  }
                  if (!spotExists) {
                    if (1 <= quantity) {
                      oneSelect104();
                    }
                    if (2 <= quantity) {
                      twoSelect104();
                    }
                    if (3 <= quantity) {
                      threeSelect104();
                    }
                    if (4 <= quantity) {
                      fourSelect104();
                    }
                    if (5 <= quantity) {
                      fiveSelect104();
                    }
                    if (6 <= quantity) {
                      sixSelect104();
                    } 
                    saveSpotColor();
                    document.save();
                  }
                  document.close();
                }
                
              }
              
            }
          }
        }
      }
    }
  
  return true;
  
}

function saveSpotColor() {
  var idMk = charIDToTypeID( "Mk  " );
    var desc302 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
      var desc303 = new ActionDescriptor();
      var idNm = charIDToTypeID( "Nm  " );
      desc303.putString( idNm, "Spot_Color1" );
      var idClr = charIDToTypeID( "Clr " );
        var desc304 = new ActionDescriptor();
        var idRd = charIDToTypeID( "Rd  " );
        desc304.putDouble( idRd, 255.000000 );
        var idGrn = charIDToTypeID( "Grn " );
        desc304.putDouble( idGrn, 0.000000 );
        var idBl = charIDToTypeID( "Bl  " );
        desc304.putDouble( idBl, 0.000000 );
      var idRGBC = charIDToTypeID( "RGBC" );
      desc303.putObject( idClr, idRGBC, desc304 );
      var idOpct = charIDToTypeID( "Opct" );
    desc303.putInteger( idOpct, 100 );
    var idSCch = charIDToTypeID( "SCch" );
    desc302.putObject( idNw, idSCch, desc303 );
  executeAction( idMk, desc302, DialogModes.NO );
}

function oneSelect103() {
  var idsetd = charIDToTypeID( "setd" );
    var desc251 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref1 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref1.putProperty( idChnl, idfsel );
    desc251.putReference( idnull, ref1 );
    var idT = charIDToTypeID( "T   " );
      var desc252 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idLeft, idPxl, 4.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idRght, idPxl, 1560.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc251.putObject( idT, idRctn, desc252 );
  executeAction( idsetd, desc251, DialogModes.NO );
}

function twoSelect103() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc260 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref2 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref2.putProperty( idChnl, idfsel );
    desc260.putReference( idnull, ref2 );
    var idT = charIDToTypeID( "T   " );
      var desc261 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idLeft, idPxl, 1970.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idRght, idPxl, 3526.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc260.putObject( idT, idRctn, desc261 );
  executeAction( idAddT, desc260, DialogModes.NO );
}

function threeSelect103() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc269 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref3 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref3.putProperty( idChnl, idfsel );
    desc269.putReference( idnull, ref3 );
    var idT = charIDToTypeID( "T   " );
      var desc270 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idLeft, idPxl, 3936.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idRght, idPxl, 5492.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc269.putObject( idT, idRctn, desc270 );
  executeAction( idAddT, desc269, DialogModes.NO );
}

function fourSelect103() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc278 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref4 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref4.putProperty( idChnl, idfsel );
    desc278.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
      var desc279 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idLeft, idPxl, 5902.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idRght, idPxl, 7458.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc278.putObject( idT, idRctn, desc279 );
  executeAction( idAddT, desc278, DialogModes.NO );
}

function fiveSelect103() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc287 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref5 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref5.putProperty( idChnl, idfsel );
    desc287.putReference( idnull, ref5 );
    var idT = charIDToTypeID( "T   " );
      var desc288 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idLeft, idPxl, 7868.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idRght, idPxl, 9424.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc287.putObject( idT, idRctn, desc288 );
  executeAction( idAddT, desc287, DialogModes.NO );
}

function sixSelect103() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc296 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref6 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref6.putProperty( idChnl, idfsel );
    desc296.putReference( idnull, ref6 );
    var idT = charIDToTypeID( "T   " );
      var desc297 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idLeft, idPxl, 9834.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idBtom, idPxl, 622.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idRght, idPxl, 11390.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc296.putObject( idT, idRctn, desc297 );
  executeAction( idAddT, desc296, DialogModes.NO );
}

function oneSelect104() {
  var idsetd = charIDToTypeID( "setd" );
    var desc251 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref1 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref1.putProperty( idChnl, idfsel );
    desc251.putReference( idnull, ref1 );
    var idT = charIDToTypeID( "T   " );
      var desc252 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idLeft, idPxl, 4.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc252.putUnitDouble( idRght, idPxl, 1560.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc251.putObject( idT, idRctn, desc252 );
  executeAction( idsetd, desc251, DialogModes.NO );
}
  
function twoSelect104() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc260 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref2 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref2.putProperty( idChnl, idfsel );
    desc260.putReference( idnull, ref2 );
    var idT = charIDToTypeID( "T   " );
      var desc261 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idLeft, idPxl, 1970.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc261.putUnitDouble( idRght, idPxl, 3526.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc260.putObject( idT, idRctn, desc261 );
  executeAction( idAddT, desc260, DialogModes.NO );
}
  
function threeSelect104() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc269 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref3 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref3.putProperty( idChnl, idfsel );
    desc269.putReference( idnull, ref3 );
    var idT = charIDToTypeID( "T   " );
      var desc270 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idLeft, idPxl, 3936.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc270.putUnitDouble( idRght, idPxl, 5492.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc269.putObject( idT, idRctn, desc270 );
  executeAction( idAddT, desc269, DialogModes.NO );
}
  
function fourSelect104() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc278 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref4 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref4.putProperty( idChnl, idfsel );
    desc278.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
      var desc279 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idLeft, idPxl, 5902.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc279.putUnitDouble( idRght, idPxl, 7458.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc278.putObject( idT, idRctn, desc279 );
  executeAction( idAddT, desc278, DialogModes.NO );
}
  
function fiveSelect104() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc287 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref5 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref5.putProperty( idChnl, idfsel );
    desc287.putReference( idnull, ref5 );
    var idT = charIDToTypeID( "T   " );
      var desc288 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idLeft, idPxl, 7868.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc288.putUnitDouble( idRght, idPxl, 9424.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc287.putObject( idT, idRctn, desc288 );
  executeAction( idAddT, desc287, DialogModes.NO );
}
  
function sixSelect104() {
  var idAddT = charIDToTypeID( "AddT" );
    var desc296 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
      var ref6 = new ActionReference();
      var idChnl = charIDToTypeID( "Chnl" );
      var idfsel = charIDToTypeID( "fsel" );
      ref6.putProperty( idChnl, idfsel );
    desc296.putReference( idnull, ref6 );
    var idT = charIDToTypeID( "T   " );
      var desc297 = new ActionDescriptor();
      var idTop = charIDToTypeID( "Top " );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idTop, idPxl, 4.000000 );
      var idLeft = charIDToTypeID( "Left" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idLeft, idPxl, 9834.000000 );
      var idBtom = charIDToTypeID( "Btom" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idBtom, idPxl, 597.000000 );
      var idRght = charIDToTypeID( "Rght" );
      var idPxl = charIDToTypeID( "#Pxl" );
      desc297.putUnitDouble( idRght, idPxl, 11390.000000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc296.putObject( idT, idRctn, desc297 );
  executeAction( idAddT, desc296, DialogModes.NO );
}


// var mainFolder = Folder(basePath);
  // if (mainFolder.exists) {
  //   var subFolders = mainFolder.getFiles();
  //   for (var i=0; i < subFolders.length; i++) {
  //     var compFolder = subFolders[i];
  //     if (compFolder instanceof Folder) {
  //       var lvlTwoSubFolders = compFolder.getFiles();
  //       for (var j=0; j < lvlTwoSubFolders.length; j++) {
  //         var currFolder = lvlTwoSubFolders[j];
  //         if (decodeURI(currFolder.name).indexOf('barcodes') >= 0) {
  //           var files = currFolder.getFiles('*.tiff');
  //           // console.log("FILENAME");
  //           // console.log(decodeURI(files[0].name));
  //           var document = app.open(files[0]);
  //           oneSelect104();
  //           twoSelect104();
  //           threeSelect104();
  //           fourSelect104();
  //           fiveSelect104();
  //           sixSelect104();
  //           saveSpotColor();
  //           document.save();
  //           document.close();
  //         }
  //       }
  //     }
  //   }
  // } else {
  //   return false;
  // }
  // return true;
const dotenv = require('dotenv')
dotenv.config()

const printer = require('../lib'),
  util = require('util')

let allPrinters = util.inspect(printer.getPrinters())

// let connectedPrinter = allPrinters.filter((value) => {
//   return value.name == process.env['PRINTER']
// })

function malformedJSON2Array(malformedArr) {
  var arr = []
  malformedArr = malformedArr.replace(/^\{|\}$/g, '').split(',')
  for (var i = 0, cur, pair; (cur = malformedArr[i]); i++) {
    arr[i] = {}
    pair = cur.split(':')
    arr[i][pair[0]] = /^\d*$/.test(pair[1]) ? +pair[1] : pair[1]
  }
  return arr
}

// console.log(malformedJSON2Array(allPrinters))

console.log('all printers: ' + allPrinters)

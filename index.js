require('dotenv').config()
const { makeWASocket, smsg, logic, protoType } = require('./system/simple')
const Functions = new (require('./system/functions'))
const Scraper = new (require('./system/scraper'))
const Converter = new (require('./system/converter'))
const Print = require('./system/print')
const Exif = new (require('./system/exif'))
const MongoDB = require('./system/mongoDB')
const CloudDBAdapter = require('./system/cloudDBAdabter')
const lowdb = require('./system/lowdb')
const Api = new (require('./system/Api'))

module.exports = class Component {
   makeWASocket = makeWASocket
   smsg = smsg
   logic = logic
   protoType = protoType
   Functions = Functions
   Scraper = Scraper
   Converter = Converter
   Print = Print
   Exif = Exif
   MongoDB = MongoDB
   CloudDBAdapter = CloudDBAdapter
   lowdb = lowdb
   Api = Api
}

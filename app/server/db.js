const config = require('./config');
const DB = require('bui-server/db')
const Model = require('bui-server/model')

const db = new DB(config.mysql)

Model.setDB(db)

module.exports = db
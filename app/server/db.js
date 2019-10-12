var config = require('./config');
var mysql = require('mysql');
var mysqlConnection = require('mysql/lib/Connection');

var db

// http://stackoverflow.com/a/20211143/484780
// TODO: http://stackoverflow.com/a/17015816/484780
function connectDB(){

	db = mysql.createConnection(config.mysql);

	db.connect(function(err){
		if(err){
			console.log('error when connecting to db:', err);
			setTimeout(connectDB, 2000);
		}
	});

	db.on('error', function(err) {
		if(err.code === 'PROTOCOL_CONNECTION_LOST'){
			connectDB();
		} else {
			console.log('db error', err);
			throw err;
		}
	});
}

// extend MySQL connection with custom nethods
Object.assign(mysqlConnection.prototype, {
	
	// perform promise based `query`
	q(sql, data){
		return new Promise((resolve, reject)=>{
			this.query(sql, data, (err, results, fields)=>{
				if( err )
					reject(err)
				else
					resolve(results)
			})	
		})
	},
	
	groupBy(key){
		return function(rows){
			let group = {}
			rows.forEach(row=>{
				if( row[key] )
					group[row[key]] =  row
			})
			return group
		}
	},
	
	getValues(rows){
		return rows.map(d=>d[Object.keys(d)[0]])
	},
	
	getValue(rows){
		let values = rows.map(d=>d[Object.keys(d)[0]])
		return values[0]
	},
	
	getRow(rows){
		return rows[0]
	}
	
})

connectDB()

module.exports = db;
let env = process.env

module.exports = {
	
	redis: {
		port: env.REDIS_PORT,
		host: env.REDIS_HOST,
	},
	
	mysql: {
		host	 : env.MYSQL_HOST,
		user	 : env.MYSQL_USER,
		password : env.MYSQL_PW,
		database : env.MYSQL_DATABASE
	}
}
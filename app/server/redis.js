const redis = require("redis")

let client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.unref()
client.on('error', console.log)

module.exports = client
const redis = require("redis")

let client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 6379
})

client.unref()
client.on('error', console.log)

module.exports = client
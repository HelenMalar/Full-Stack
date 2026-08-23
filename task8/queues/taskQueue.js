const { Queue } = require("bullmq");
const redisConnection = { host: "127.0.0.1", port: 6379 }; 
const myQueue = new Queue("myBackgroundQueue", { connection: redisConnection });
module.exports = myQueue;
const { Worker } = require("bullmq");
const redisConnection = { host: "127.0.0.1", port: 6379 };
const worker = new Worker("myBackgroundQueue", async (job) => {
  console.log(`Processing job ${job.id} with data:`, job.data);
  await new Promise(res => setTimeout(res, 5000)); 
  console.log(`Job ${job.id} completed! ✅`);
}, { connection: redisConnection });
console.log("Worker is running and waiting for jobs...");
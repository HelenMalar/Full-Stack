const redis = require("../config/redis");
const myQueue = require("../queues/taskQueue");
exports.getUsers = async (req, res) => {
  try {
    const cacheKey = "users";
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Cache");
      return res.json(JSON.parse(cachedData));
    }
    console.log("Fetching from Database...");
    const users = [
      { id: 1, name: "Helen" },
      { id: 2, name: "John" }
    ];
    await redis.set(cacheKey, JSON.stringify(users), "EX", 60);
    await myQueue.add("testJob", { message: "Hello from the background!" });
    return res.json({
      message: "Request received and background task started!",
      data: users
    });
    } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
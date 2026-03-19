const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("error", (err) => {
  console.error("Redis Error:", err);
});

(async () => {
  try {
    await client.connect();
    console.log("✅ Connected to Redis cache");
  } catch (error) {
    console.error("❌ Failed to connect to Redis", error);
  }
})();

module.exports = client;

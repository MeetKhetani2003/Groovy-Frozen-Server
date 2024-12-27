import { createClient } from 'redis';

// Replace with your Redis credentials
const redisHost = 'redis-15690.c266.us-east-1-3.ec2.redns.redis-cloud.com';
const redisPort = 15690;
const redisPassword = 'AiClG9IsqdTtrz83rLnPpFmv8oRTNNjd'; // If your Redis instance has a password, include it

export const redisClient = createClient({
  url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`
});

redisClient.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

await redisClient.connect(); // Ensure the connection is established

# Redis Configuration Guide

This guide explains how to set up and configure Redis caching for the Restaurant application.

## Overview

Redis is used for:
- **Response Caching** - Cache API responses to reduce database load
- **Session Caching** - Store temporary session data
- **Menu/Category Caching** - Cache frequently accessed data

## Prerequisites

- **Redis Server** 6.0 or higher
- **Redis CLI** (command-line interface)

## Installation

### Windows

#### Option 1: Using Chocolatey
```bash
choco install redis-64
```

#### Option 2: Using WSL (Recommended)
```bash
# Inside WSL Ubuntu
sudo apt-get install redis-server

# Start Redis
redis-server
```

#### Option 3: Using Docker
```bash
docker run -d -p 6379:6379 redis:latest
```

### macOS

```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis
```

### Linux

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify
redis-cli ping
# Expected output: PONG
```

## Configuration

### Environment Variables

Set in your `.env` file:

```bash
# Redis URL (optional, defaults to localhost:6379)
REDIS_URL=redis://localhost:6379

# With password (if configured)
REDIS_URL=redis://:password@localhost:6379

# With database selection
REDIS_URL=redis://localhost:6379/1
```

### Advanced Configuration

For production deployments, edit Redis configuration file:

**Linux**: `/etc/redis/redis.conf`
**macOS**: `/usr/local/etc/redis.conf`
**Windows**: `C:\Program Files\Redis\redis.conf`

Key settings:

```conf
# Password protection
requirepass your_strong_password_here

# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1        # Save if 1 key changed in 900 seconds
save 300 10       # Save if 10 keys changed in 300 seconds
save 60 10000     # Save if 10000 keys changed in 60 seconds

# Replication (optional)
# slaveof 127.0.0.1 6380

# Logging
loglevel notice
logfile ""
```

## Starting Redis

### Development

```bash
# Start in foreground (for development)
redis-server

# Or start as daemon/service
# Windows: redis-server --service-start
# macOS: brew services start redis
# Linux: sudo systemctl start redis-server
```

### Testing Connection

```bash
# Test connection
redis-cli ping
# Expected: PONG

# Check server info
redis-cli info server

# Monitor commands (real-time)
redis-cli monitor
```

## Graceful Degradation

If Redis is unavailable:
- ✅ Application continues to work
- ⚠️ Caching is disabled (responses sent directly)
- 📊 Performance impact: Slightly slower responses
- 🔄 Automatic retry with exponential backoff

The app logs warnings instead of errors:
```
⚠️ Redis connection failed: connect ECONNREFUSED 127.0.0.1:6379. Caching will be disabled.
📌 Using mock Redis client (no-op caching)
```

## Cache Keys Structure

| Feature | Cache Key | TTL |
|---------|-----------|-----|
| Menu Items | `menu:*` | 10 min |
| Categories | `categories:*` | 10 min |
| User Profile | `user:profile:{userId}` | 5 min |
| Cart | `cart:user:{userId}` | 2 min |
| Reviews | `reviews:*` | 5 min |
| API Responses | `{originalUrl}` | Custom |

## Monitoring

### Using Redis CLI

```bash
# Connect to Redis
redis-cli

# View all keys
KEYS *

# View specific key
GET key_name

# View key info
INFO

# Get memory usage
INFO memory

# Monitor commands in real-time
MONITOR

# Check number of keys
DBSIZE

# Clear cache
FLUSHALL

# Exit
EXIT
```

### Redis Desktop Manager

- Install: [Red Desktop Client](https://github.com/lework/RedisDesktopManager)
- GUI for visual cache inspection
- Browser-based: http://bit.ly/2U0tSYT

## Troubleshooting

### Issue: "connect ECONNREFUSED 127.0.0.1:6379"

**Cause**: Redis server is not running

**Solution**:
```bash
# Start Redis
redis-server

# Or verify it's running
redis-cli ping
# Should return: PONG
```

### Issue: "MAXMEMORY limit exceeded"

**Cause**: Redis memory is full

**Solution**:

```bash
# In redis-cli
CONFIG GET maxmemory
CONFIG SET maxmemory 512mb

# Or edit redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
```

### Issue: "AuthenticationError: NOAUTH Authentication required"

**Cause**: Redis requires password

**Solution**: Add password to `.env`:
```bash
REDIS_URL=redis://:your_password@localhost:6379
```

### Issue: Cache not being used

**Check**:
```bash
# Monitor Redis commands
redis-cli MONITOR

# Make API request and check x-cache header
curl -i http://localhost:5000/api/menu
# Look for: X-Cache: HIT or X-Cache: MISS
```

## Performance Tips

1. **Enable Persistence** (optional)
   - Trade memory for durability
   - Use AOF for high write workloads

2. **Set Appropriate Memory Limits**
   - Monitor with `INFO memory`
   - Use `maxmemory-policy allkeys-lru` for auto-eviction

3. **Use Key Expiration**
   - All cache keys auto-expire (TTL)
   - Prevents memory bloat

4. **Monitor Cache Hit Rate**
   - Check: `INFO stats` → `keyspace_hits` vs `keyspace_misses`
   - Goal: >80% hit rate for optimal performance

## Production Considerations

- ✅ Use **Redis Cluster** or **Sentinel** for high availability
- ✅ Enable **password authentication**
- ✅ Enable **AOF persistence** for data safety
- ✅ Monitor with tools like **RedisInsight**
- ✅ Set up **alerts** for memory/CPU usage
- ✅ Use **managed Redis** services (AWS ElastiCache, Azure Cache, etc.)

## Integration with Application

### Automatic Caching

Routes with caching middleware:
- `GET /api/menu` - 10 minute cache
- `GET /api/categories` - 10 minute cache
- `GET /api/reviews` - 5 minute cache

Cache is invalidated on:
- `POST`, `PUT`, `DELETE` requests
- Content updates

### Manual Cache Control

```javascript
// Clear specific cache
const { getClient } = require('./config/redis');
const client = getClient();
await client.del('menu:all');

// Clear all cache
await client.flushAll();

// Get cache stats
const info = await client.info('stats');
```

## Health Check

Add Redis to your health check endpoint:

```bash
curl http://localhost:5000/api/health
```

Response includes Redis status (if available)

## References

- [Redis Documentation](https://redis.io/documentation)
- [Node.js Redis Client](https://github.com/redis/node-redis)
- [Redis Best Practices](https://redis.io/topics/client-side-caching)

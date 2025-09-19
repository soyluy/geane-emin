# Use the official Redis Alpine base image
FROM redis:7-alpine

# Copy in your custom Redis config
# (create a redis.conf alongside this Dockerfile)
COPY redis.conf /usr/local/etc/redis/redis.conf

# Expose the Redis port
EXPOSE 6379

# Run Redis with your config file
CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
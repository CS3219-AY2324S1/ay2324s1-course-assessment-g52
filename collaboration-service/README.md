# Instructions

The collaboration service is meant to run within a VM with a locally running redis server. 

Before running the application, make sure that the redis database is up and running. 

`docker pull redis:latest`

`docker run -d -p 6379:6379 redis`

You can also optionally choose to download the redis-cli to interact directly with the redis server since we won't be installing any GUI e.g RedisInsight


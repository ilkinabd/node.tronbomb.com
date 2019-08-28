# Node
v0.9.0 Aug 28, 2019

Microservice for **TronBomb** smart contracts.

## Get Started

0. Install **node** v10+, **yarn**, **pm2** and **postgres** 10+.
1. Create database from config [db/config.sql](./db/config.sql).
2. Create **process.yml** config file. Read **Config** part.
3. Install packages and start.
```
yarn
yarn start
```
4. Stop and Restart tools
```
yarn stop
yarn restart
```
5. Logs and Errors tools
```
yarn logs
yarn errors
```

## Config

Use **process.yml** config.

```
name            : bomb-node
script          : server.js
log_date_format : YYYY-MM-DD HH:MM:SS Z
error_file      : /data/app/logs/node-app.stderr.log
out_file        : /data/app/logs/node-app.stdout.log
pid_file        : /home/app/.pm2/pids/bomb.pid
instances       : '1'
watch           : true
merge_logs      : true
autorestart     : true
env:
  NODE_ENV        : development
  NODE_URL        : localhost
  NODE_PORT       : 3000
  PG_HOST         : 127.0.0.1                       // Postgres host
  PG_USER         : postgres                        // Postgres user
  PG_PORT         : 5432                            // Postgres port
  PG_PASS         : pass1234                        // Postgres password
  PG_DB           : tron_bomb_node                  // Postgres database
  PRIVATE_KEY     : 123456789...abcdef              // Main wallet private key
  PROVIDER        : https://api.shasta.trongrid.io  // TRON provider
  TOKEN           : 123456789abcdef                 // Server auth token
  ADMIN_TOKEN     : 123456789abcdef                 // Admin auth token
  IV              : 123456789...abcdef              // IV for private key encrypt
  SECRET          : 123456789abcdef                 // TOP SECRET
```

Powered by 2019 © MaxieMind for © TronBomb.

# GeekyAnts Framework

## Setup

- Minimum Node version to be 16 & above.
- Install & Open Docker Deamon (Docker application)
- Add `.env` file and copy the content from `.env.example` file and add the actual/dummy values for all the fields in order to avoid issues at run-time.

## Running the app

```bash
# Install dependencies
$ npm install

# Setup Database (postgres)
$ docker compose up -d

# Run the Prisma Setup
$ npm run prisma:setup

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

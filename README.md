## Prerequisites

-   [Node.js](https://nodejs.org/) (>= 18.13.0)
-   [yarn](https://yarnpkg.com/) (>= 1.22.17)

## Installation

```bash
$ yarn install
```

## Setting up

Copy .env.example to .env

```shell
$ cp .env.example .env
```
Add your envs

## Running the app

```bash
# dev worker
$ yarn start:tx-worker:dev

# dev api
$ yarn start:tx-api:dev
```
## Other commands

```shell
# formatting code
$ yarn format

# generate migrations {name-migration} - change the name for your migration
$ yarn migration:generate db/migrations/{name-migration}

# run migrations
$ yarn migration:run 

# revert one migration from database
$ yarn migration:revert

```

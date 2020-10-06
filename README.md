# Baby-foot API and dashboard

[![Build Status](https://travis-ci.org/Falinor/baby-foot-api.svg?branch=master)](https://travis-ci.org/Falinor/baby-foot-api)
[![Coverage Status](https://coveralls.io/repos/github/Falinor/baby-foot-api/badge.svg?branch=master)](https://coveralls.io/github/Falinor/baby-foot-api?branch=master)

## Installation

With npm:

```text
$ npm install
```

With yarn:

```text
$ yarn [install]
```

## API documentation

You can serve API documentation locally using Docker:

```text
$ docker pull swaggerapi/swagger-ui
$ docker run -p 80:8080 -e SWAGGER_JSON=/docs/openapi.json -v $PWD/docs/v3:/docs swaggerapi/swagger-ui
```

You may change the port *80* if it does not fit your needs or is already in use.

## Features

Here are the live, in-development and proposed features. Do not hesitate to
propose a feature by opening an issue or send a pull-request with yours. Enjoy!

### Live

None yet!

### In active development

- Top 10 players
  - Win rate by player `GET /v1/players?sort=-winRate&limit=10`
- Top 10 teams
  - Win rate by team `GET /v1/teams?sort=-winRate&limit=10`
- Individual rank and scores
- The last 10 matches `GET /v1/matches`
- View a player's teams `GET /v1/players/{id}/teams`
- View a player's matches `GET /v1/players/{id}/matches`
- List the players with who I already played `GET /v1/players/{id}/players`
- Have I played with this player? `GET /v1/players/{id}/players/{id}`
- Analytics dashboard
  - Count of matches played

### Proposed features

- Link to AskBob API for players (tooltip)

## Architecture

The technical architecture of the project is contained in
*architecture-draft.xml*. It may be open with the Chrome application *draw.io*.

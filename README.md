# Baby-foot API and dashboard

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

Here are the live, in development and proposed features. Do not hesitate to
propose a feature by opening an issue or send a pull-request with yours. Enjoy!

### Live

None yet!

### In active development

- Top ranked players
  - Win rate by player
- Top ranked teams
  - Win rate by team
- Individual rank and scores
- Latest matches
- Analytics dashboard
  - Count of matches played

### Proposed features

- Link to AskBob API for players (tooltip)

## Architecture

The technical architecture of the project is contained in
*architecture-draft.xml*. It may be open with the Chrome application *draw.io*.

# TODO

Create a player first, then a team, then a match? (preferred option)
Or create a match first, then a team, then a player?

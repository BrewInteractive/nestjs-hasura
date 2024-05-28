# Local Development Instructions

Since the project is a project developed specifically for Hasura, care should be taken to ensure that it does not contain Hasura-specific enhancements.

## Requirements

- Node.js (>= 21.x)
- npm (>= 10.x)

## Installation

### Clone Project

First, clone the project to your local environment:

```bash
$ git clone https://github.com/BrewInteractive/nestjs-hasura-module.git
$ cd nestjs-hasura-module
```

### Package Installation

To install the required dependencies in the project directory:

```bash
$ yarn install
```

## Test

There are unit tests for the project. To run the tests:

```bash
# To run tests in monitoring mode:
$ yarn test

# To run tests in monitoring mode:
$ yarn run test:watch

# To generate a test coverage report:
$ yarn run test:cov
```

## Build

You can use the following command to compile the project.

```bash
$ yarn build
```

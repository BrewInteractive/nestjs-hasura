# Local Development Instructions

Since the project is a project developed specifically for Hasura, care should be taken to ensure that it does not contain Hasura-specific enhancements.


## Requirements
* Node.js (>= 21.x)
* npm (>= 10.x)

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
$ npm install
```

## Test
There are unit tests for the project. To run the tests:

```bash
# To run tests in monitoring mode:
$ npm test

# To run tests in monitoring mode:
$ npm run test:watch

# To generate a test coverage report:
$ npm run test:cov
```

## Build

You can use the following command to compile the project.

```bash
$ npm run build
```

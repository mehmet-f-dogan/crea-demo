# Movie Management System

## Overview

This project is a Movie Management System developed using Node.js and the NestJS framework. It provides a RESTful API for managing movies, including user registration, movie management by managers, and ticket purchases by customers. There is no user interface; only the API is implemented.

Live API link:

https://crea-demo.vercel.app/

Note: Each commit to the master branch gets automatically pulled, builded and deployed by Vercel.

## Requirements

- Postgres >= 11
- Node >= 16

## Installation

```bash
$ npm install
```

## Running the app

Make sure the database is running.
Update/create .env according to .env.example.

```bash
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
```

## API Endpoints

Swagger:
<br>
http://localhost:3000/api#/

The following endpoints are available in the API:

- Auth Endpoints

  - POST /auth/signup - Register a new user.
  - POST /auth/login - Log in a user, returns a token.

- User Endpoints

  - POST /users/activate-mod - Make a user a Manager.
  - POST /users/history - Get a users watch history.

- Movie Endpoints

  - GET /movies - List all movies, optionally with filtering and sorting.
  - POST /movies - Add a new movie (Manager only).
  - PATCH /movies/:id - Update a movie (Manager only).
  - DELETE /movies/:id - Delete a movie (Manager only).
  - POST /movies/bulk - Add movies in bulk (Manager only).
  - DELETE /movies/bulk - Delete movies in bulk (Manager only).

- Ticket Endpoints
  - POST /tickets - Buy a ticket.
  - POST /tickets/redeem/:id - Redeem a ticket and add it to user history.

## Approach and Challenges

In this project, I followed the principles of Domain-Driven Design to structure the application. One of the significant challenges was ensuring the proper validation and handling of movie session timings to prevent double-booking of rooms. Middleware and guards were used extensively to secure endpoints and manage user roles effectively.

When it comes to tests, I have created unit tests for session and movie services. The reason for it is that, rest of the services mostly do basic CRUD and operations.

E2E tests test most important movies endpoints and auth endpoints.

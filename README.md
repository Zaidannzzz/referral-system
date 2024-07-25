## Description
This project is a referral system built with NestJS. You can check out the live application [here](https://referral-system-bay.vercel.app/).

## Installation

To install the required dependencies, run:

```bash
$ npm install
```

## Running the app

To start the application, you have several options:

Development Mode: For development with live reloading, run:
```bash
# watch mode
$ npm run start:dev
```

Production Mode: For production, run:
```bash
# production mode
$ npm run start:prod
```

## Test

To run tests, use the following commands:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Endpoints

### Authentication

- **User Registration**
  - **Endpoint:** `POST /auth/register`
  - **Request Body:**
    ```json
    {
      "username": "user",
      "password": "password",
      "referralCode": "optionalReferralCode"
    }
    ```
  - **Response:**
    - **Status Code:** `201 Created`
    - **Body:** The created user object including a unique referral code.

- **User Login**
  - **Endpoint:** `POST /auth/login`
  - **Request Body:**
    ```json
    {
      "username": "user",
      "password": "password"
    }
    ```
  - **Response:**
    - **Status Code:** `200 OK`
    - **Body:** A JWT token.

### Users (Protected)

- **Get All Users**
  - **Endpoint:** `GET /users`
  - **Response:**
    - **Status Code:** `200 OK`
    - **Body:** A list of all users.

- **Get User by ID**
  - **Endpoint:** `GET /users/:id`
  - **Response:**
    - **Status Code:** `200 OK`
    - **Body:** The user object.
    - **Error Response:** 
      - **Status Code:** `404 Not Found` if the user is not found.

- **Get Referrals**
  - **Endpoint:** `GET /users/:id/referrals`
  - **Response:**
    - **Status Code:** `200 OK`
    - **Body:** A list of users referred by the user with the given ID.

### Purchases (Protected)

- **Create a Purchase**
  - **Endpoint:** `POST /purchases`
  - **Request Body:**
    ```json
    {
      "userId": "user_id",
      "amount": 100
    }
    ```
  - **Response:**
    - **Status Code:** `201 Created`
    - **Body:** The created purchase object and updated referral earnings.

- **Get All Purchases**
  - **Endpoint:** `GET /purchases`
  - **Response:**
    - **Status Code:** `200 OK`
    - **Body:** A list of all purchases.
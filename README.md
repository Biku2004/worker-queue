## Mimicking Queue and Worker Function
(Assuming Leetcode backend)

This repository contains two main services:

- **express-backend**: An Express.js API for receiving code submissions.
- **worker**: A background worker that processes submissions from a Redis queue.

```
express-backend/
  ├── src/
  │   └── index.ts
  ├── package.json
  └── tsconfig.json

worker/
  ├── src/
  │   └── index.ts
  ├── package.json
  └── tsconfig.json
```

## How It Works

1. **express-backend** exposes a `/submit` endpoint. When a user submits code, the backend pushes the submission to a Redis list called `submissions`.
2. **worker** connects to the same Redis instance and continuously polls the `submissions` list. When a new submission arrives, it processes the submission.

### Running the Services

Start your Redis server first.

#### Express Backend

```sh
cd express-backend
tsc -b
node dist/index.js
```

#### Worker

```sh
cd worker
tsc -b
node dist/index.js
```

## API

### POST `/submit`

Submit a solution to a problem.

**Request Body:**

```json
{
  "problemId": "1",
  "userId": "12",
  "code": "Merge Sorted Linked List", ## this is just mimicking and not talking any code so we are passing as just strings
  "language": "cpp"
}
```

**Response:**

- `200 OK` if submission is received and stored
- `500 Internal Server Error` if storing fails

## Notes

- Submissions are stored in Redis and processed asynchronously by the worker.



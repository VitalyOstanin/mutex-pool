# Simple workers pool using async mutex

[![npm version](https://img.shields.io/npm/v/@vitalyostanin/mutex-pool.svg)](https://www.npmjs.com/package/@vitalyostanin/mutex-pool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/VitalyOstanin/mutex-pool/actions/workflows/ci.yml/badge.svg)](https://github.com/VitalyOstanin/mutex-pool/actions)

A simple and lightweight worker pool library using semaphores from [async-mutex](https://github.com/DirtyHairy/async-mutex).

**[Русская версия](README-ru.md)**

## Features

- Control concurrent task execution with configurable pool size
- Simple async/await based API
- TypeScript support out of the box
- Lightweight implementation
- Fully tested

## Installation

```bash
npm install @vitalyostanin/mutex-pool
```

## Usage

### Basic Example

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

// Create a pool with maximum 3 concurrent tasks
const pool = new MutexPool(3);

// Process jobs from an async iterator
for await (const jobData of asyncInputIterator) {
  const job = async () => {
    console.log('Processing job', { jobData });
    // Your async logic here
  };

  await pool.start(job);
}

// Wait for all jobs to complete
await pool.allJobsFinished();
```

### Advanced Example

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

async function processItems(items: string[]) {
  const pool = new MutexPool(5); // Maximum 5 concurrent tasks
  const results: string[] = [];

  for (const item of items) {
    const job = async () => {
      // Simulate API call or long operation
      const result = await fetchData(item);
      results.push(result);
    };

    await pool.start(job);
  }

  // Wait for all tasks to complete
  await pool.allJobsFinished();

  return results;
}
```

### Progress Tracking

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

const pool = new MutexPool(3);
const tasks = Array.from({ length: 10 }, (_, i) => i);

for (const taskId of tasks) {
  const job = async () => {
    console.log(`Task ${taskId} started`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Task ${taskId} finished`);
  };

  await pool.start(job);

  // Check available slots
  const available = pool.getSemaphoreValue();
  console.log(`Available slots: ${available}`);
}

await pool.allJobsFinished();
console.log('All tasks completed!');
```

## API

### `MutexPool`

#### `constructor(size: number)`

Creates a new pool with the specified size.

**Parameters:**
- `size` - maximum number of concurrent tasks

**Example:**
```typescript
const pool = new MutexPool(5);
```

#### `start(job: Job): Promise<{ jobFinished: Promise<void> }>`

Starts a job in the pool. Returns immediately after the job starts, without waiting for completion.

**Parameters:**
- `job` - async function to execute

**Returns:**
- Object with `jobFinished` promise that resolves when the job completes

**Example:**
```typescript
const { jobFinished } = await pool.start(async () => {
  await someAsyncOperation();
});

// You can wait for specific job completion
await jobFinished;
```

#### `allJobsFinished(): Promise<void>`

Waits for all started jobs to complete.

**Example:**
```typescript
await pool.allJobsFinished();
console.log('All jobs completed');
```

#### `getSemaphoreValue(): number`

Returns the number of available slots in the pool.

**Returns:**
- Number of available slots (0 means all slots are occupied)

**Example:**
```typescript
const available = pool.getSemaphoreValue();
console.log(`Available slots: ${available}`);
```

### Types

#### `Job`

```typescript
type Job = () => Promise<void>;
```

Type for a job function that takes no parameters and returns a Promise<void>.

## Why not other libraries?

Just for fun - this is the main reason.

### [p-limit](https://github.com/sindresorhus/p-limit)

I know the only way to wait for all jobs to finish:
```javascript
await Promise.all(limitedFnList);
```

But in my case there is no `limitedFnList` and I don't want to build it from async input generator.

### [p-ratelimit](https://github.com/natesilva/p-ratelimit)

You can use `mutex-pool` in combination with `p-ratelimit`, where `mutex-pool` is responsible for consuming input and `p-ratelimit` is responsible for calling external resources.

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Vitaly Ostanin <vitaly.ostanin@mail.ru>

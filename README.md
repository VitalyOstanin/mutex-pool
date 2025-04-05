# Simple workers pool using async mutex

Inspired by module [async-mutex](https://github.com/DirtyHairy/async-mutex).

# Usage

```sh
npm install --save @vitalyostanin/mutex-pool
```

```typescript
import { MutexPool } from "@vitalyostanin/mutex-pool";

// ...

const pool = new MutexPool(3);

for await (const jobData of asyncInputIterator) {
  const job = () => console.log('jobData', { jobData } );

  await pool.start(job);
}

await pool.allJobsFinished();

// ...
```

# Why not something

Just for fun - this is the main reason.

## [p-limit](https://github.com/sindresorhus/p-limit)

I know the only way to wait for all jobs to finish:
```js
await Promise.all(limitedFnList);
```

But in my case there is no `limitedFnList` and I don't want to build it from async input generator.

## [p-ratelimit](https://github.com/natesilva/p-ratelimit)

You can use `mutex-pool` in combination with `p-ratelimit`, where `mutex-pool` is responsible of consuming input and `p-ratelimit` is responsible of calling external resources.

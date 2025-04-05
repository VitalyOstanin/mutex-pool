import { scheduler } from "node:timers/promises";
import { Job, MutexPool } from "../src";

describe('MutexPool', () => {

  it('should work in correct order', async () => {
    const loggedResult: string[] = [];
    const expectedResult = [
      'semaphoreValue 2 job 1 started...',
      'semaphoreValue 1 job 2 started...',
      'semaphoreValue 0 job 3 started...',
      'semaphoreValue 2 job 1 finished',
      'semaphoreValue 0 job 4 started...',
      'semaphoreValue 1 job 2 finished',
      'semaphoreValue 0 job 5 started...',
      'semaphoreValue 0 job 3 finished',
      'semaphoreValue 0 job 4 finished',
      'semaphoreValue 0 job 5 finished',
      'all jobs finished',
    ];

    function log(msg: string) {
      loggedResult.push(msg);
    }

    async function* createAsyncGenerator() {
      await scheduler.wait(10);
      yield 1;
      await scheduler.wait(10);
      yield 2;
      await scheduler.wait(10);
      yield 3;
      await scheduler.wait(10);
      yield 4;
      await scheduler.wait(10);
      yield 5;
    }

    const pool = new MutexPool(3);

    const demo = async (jobNumber: number) => {
      const semaphoreValue = pool.getSemaphoreValue();

      log(`semaphoreValue ${semaphoreValue} job ${jobNumber} started...`);

      await scheduler.wait(100);

      log(`semaphoreValue ${semaphoreValue} job ${jobNumber} finished`);
    };

    for await (const jobNumber of createAsyncGenerator()) {
      const job: Job = () => demo(jobNumber);

      const { jobFinished } = await pool.start(job);

      // You can wait for jobFinished here. It will disable concurrency.
      // Usually there is no need to wait for each job to finish:
      //
      // await jobFinished;
    }

    await pool.allJobsFinished();

    log("all jobs finished");

    console.log('loggedResult: ', loggedResult);

    expect(loggedResult).toEqual(expectedResult);
  });
});

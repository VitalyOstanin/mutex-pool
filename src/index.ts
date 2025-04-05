import { Semaphore, SemaphoreInterface } from 'async-mutex';

export type Job = () => Promise<void>;

export class MutexPool {
  private readonly semaphore;

  constructor(private readonly size: number) {
    this.semaphore = new Semaphore(this.size);
  }

  private async doJob(job: Job, release: SemaphoreInterface.Releaser) {
    try {
      await job();
    } finally {
      release();
    }
  }

  async start(job: Job) {
    // wait for job to start
    const [_, release] = await this.semaphore.acquire();

    // don't wait for job to finish
    return {
      jobFinished: this.doJob(job, release),
    };
  }

  async allJobsFinished() {
    await this.semaphore.waitForUnlock(this.size);
  }

  getSemaphoreValue() {
    return this.semaphore.getValue();
  }
}

import type { Logger } from '@packages/logger';
import type { HttpError } from '@packages/shared';

export type Task = () => Promise<void> | void;

export interface TaskMetadata {
  name: string;
  task: Task;
}
export interface EnqueueTaskOptions {
  name: string;
  queueId: string;
}

export class Sequencer {
  private processing: Map<string, boolean> = new Map();
  private queues: Map<string, TaskMetadata[]> = new Map();
  private readonly logger: Logger;

  constructor(options: { logger: Logger }) {
    const { logger } = options;

    this.logger = logger;
  }

  private async processQueueTasks(queueId: string): Promise<void> {
    const isQueueAlreadyInProcessing = this.processing.get(queueId);

    if (isQueueAlreadyInProcessing) {
      return;
    }

    const queue = this.queues.get(queueId);

    /**
     * After the while loop, queue should be empty, but in the meantime, new
     * tasks could have been added to the queue so the only safe way to free
     * up resources is before running a new cycle.
     */
    if (!queue || queue.length === 0) {
      this.queues.delete(queueId);
      this.processing.delete(queueId);

      return;
    }

    this.processing.set(queueId, true);

    while (queue.length > 0) {
      const { name, task } = queue.shift()!;

      try {
        await task();
      } catch (error) {
        this.logger.error(
          `[Queue] Error processing task ${name} for queue ${queueId}`,
          { error: error as HttpError },
        );
      }
    }

    this.processing.set(queueId, false);
  }

  enqueueTask(task: Task, options: EnqueueTaskOptions) {
    const { name, queueId } = options;
    const targetQueue = this.queues.get(queueId) || [];

    targetQueue.push({ name, task });
    this.queues.set(queueId, targetQueue);
    this.processQueueTasks(queueId);
  }
}

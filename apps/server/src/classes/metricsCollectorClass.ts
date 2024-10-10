import { CacheTopic } from '#src/constants/cacheConstants.js';
import { pushCacheArrayElementByKey } from '#src/queries/cache/updateCacheQueries.js';

export interface ServerMetric {
  description?: string | null;
  endTime: number;
  name: string;
  startTime: number;
}

export interface MetricsCollectorOptions {
  requestId: string;
}

/**
 * Track metrics to construct {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing/ | Server-Timing} HTTP header
 * related data.
 */
export class MetricsCollector {
  /** Endpoint where the error occurred. */
  public readonly metrics: Map<string, ServerMetric>;
  public readonly requestId: string;

  constructor(options: MetricsCollectorOptions) {
    this.metrics = new Map();
    this.requestId = options.requestId;
  }

  public startTracking(options: { description?: string; name: string }) {
    const { description = null, name } = options;

    this.metrics.set(name, {
      description,
      endTime: 0,
      name,
      startTime: performance.now(),
    });
  }

  public async stopTracking(name: string) {
    const metric = this.metrics.get(name);

    if (metric) {
      metric.endTime = performance.now();
      await this.serialize(metric);
    }
  }

  /**
   * Format the metrics data to be used in the {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing/ | Server-Timing} HTTP header.
   */
  private async serialize(metric: ServerMetric) {
    const { description, endTime, name, startTime } = metric;
    const duration = endTime - startTime;
    const baseData = `${name}; dur=${duration}`;
    const serializedData = description
      ? `${baseData}; desc="${description}"`
      : baseData;

    await pushCacheArrayElementByKey({
      key: `${CacheTopic.ServerMetrics}:${this.requestId}`,
      value: serializedData,
    });
  }
}

export interface ServerMetric {
  description?: string | null;
  endTime: number;
  name: string;
  startTime: number;
}

/**
 * Track metrics to construct {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing/ | Server-Timing} HTTP header
 * related data.
 */
export class MetricsCollector {
  /** Endpoint where the error occurred. */
  public readonly metrics: Map<string, ServerMetric>;

  constructor() {
    this.metrics = new Map();
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

  public stopTracking(name: string) {
    const metric = this.metrics.get(name);

    if (metric) {
      metric.endTime = performance.now();
    }
  }

  /**
   * Format the metrics data to be used in the {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing/ | Server-Timing} HTTP header.
   */
  public serialize() {
    const now = performance.now();

    return [...this.metrics.values()]
      .map(({ description, endTime, name, startTime }) => {
        const duration = (endTime || now) - startTime;
        const baseData = `${name}; dur=${duration}`;

        return description ? `${baseData}; desc="${description}"` : baseData;
      })
      .join(', ');
  }
}

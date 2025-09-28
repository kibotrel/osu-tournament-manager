export enum CacheEvent {
  Error = 'error',
}

export enum CacheTopic {
  OpenMatches = 'open-matches',
  ServerMetrics = 'server-metrics',
}

export enum CacheListTopic {
  ServerMetrics = CacheTopic.ServerMetrics,
}

export enum CacheSetTopic {
  OpenMatches = CacheTopic.OpenMatches,
}

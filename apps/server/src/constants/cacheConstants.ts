export enum CacheEvent {
  Error = 'error',
}

export enum CacheExpiry {
  MatchMessages = 3600,
}

export enum CacheTopic {
  MatchMessages = 'match-messages',
  OpenMatches = 'open-matches',
  ServerMetrics = 'server-metrics',
}

export enum CacheListTopic {
  MatchMessages = CacheTopic.MatchMessages,
  ServerMetrics = CacheTopic.ServerMetrics,
}

export enum CacheSetTopic {
  OpenMatches = CacheTopic.OpenMatches,
}

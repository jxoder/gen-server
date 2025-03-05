export const RMQ_NAME = {
  GPU_SERVICE: 'GPU_SERVICE', // gpu 서버만 consume 하는 큐 (example. ai 관련)
} as const

export type RmqNameType = (typeof RMQ_NAME)[keyof typeof RMQ_NAME]

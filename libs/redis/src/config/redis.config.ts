import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export const REDIS_CONFIG_KEY = 'redis'

export interface IRedisConfig {
  HOST: string
  PORT: number
  PASSWORD: string
}

export const redisConfig = registerAs(REDIS_CONFIG_KEY, () => ({
  HOST: get('REDIS_HOST').default('localhost').asString(),
  PORT: get('REDIS_PORT').default(6379).asPortNumber(),
  PASSWORD: get('REDIS_PASSWORD').asString(),
}))

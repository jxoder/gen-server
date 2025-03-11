import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { catchError, defer, lastValueFrom, retry, timer } from 'rxjs'
import { IRedisConfig, REDIS_CONFIG_KEY, redisConfig } from './config'

export class RedisSubscriber extends Redis {}

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [
    {
      provide: Redis,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config = configService.getOrThrow<IRedisConfig>(REDIS_CONFIG_KEY)
        const redis = new Redis({
          lazyConnect: true,
          host: config.HOST,
          port: config.PORT,
          password: config.PASSWORD,
        })

        return lastValueFrom(
          defer(() => redis.connect()).pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.error(`Failed redis connect attempt ${retryCount}`)
                return timer(3000)
              },
            }),
            catchError(error => {
              console.error(`Failed to connect to redis: ${error?.message}`)
              throw error
            }),
          ),
        )
      },
    },
    {
      provide: RedisSubscriber,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { HOST, PORT, PASSWORD } = configService.get<IRedisConfig>(
          'redis',
          { infer: true },
        )
        const redis = new Redis({
          lazyConnect: true,
          host: HOST,
          port: PORT,
          password: PASSWORD,
        })

        await lastValueFrom(
          defer(() => redis.connect()).pipe(
            retry({
              count: 3,
              delay: (error, retryCount) => {
                console.error(`Failed redis connection attempt ${retryCount}`)
                return timer(3000)
              },
            }),
            catchError(error => {
              console.log(`Failed to connect to redis: ${error?.message}`)
              throw error
            }),
          ),
        )

        return redis
      },
    },
  ],
  exports: [Redis, RedisSubscriber],
})
export class RedisModule {}

import { INestApplication, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { COMMON_CONFIG_KEY, ICommonConfig } from '@slibs/common'
import cluster from 'cluster'
import compression from 'compression'
import { Request, Response } from 'express'
import { cpus } from 'os'
import { mw } from 'request-ip'
import { API_CONFIG_KEY, IApiConfig } from '../config'
import { setupSwagger } from './swagger.setup'

export class Bootstrap {
  constructor(private readonly module: any) {}

  async listen(additionalFn?: (app: INestApplication) => void) {
    const app = await NestFactory.create<INestApplication>(this.module)
    const configService = app.get(ConfigService)

    const commonConfig =
      configService.getOrThrow<ICommonConfig>(COMMON_CONFIG_KEY)
    const apiConfig = configService.getOrThrow<IApiConfig>(API_CONFIG_KEY)

    app.use(mw())
    app.use(
      compression({
        filter: (req: Request, res: Response) => {
          if (req.get('x-no-compression') === '1') {
            return false
          }
          return compression.filter(req, res)
        },
      }),
    )

    app.use('/favicon.ico', (_: Request, res: Response) => {
      res.status(204).end()
    })

    app.useLogger([commonConfig.LOG_LEVEL])
    app.enableVersioning({ type: VersioningType.URI })

    app.enableCors({
      origin: apiConfig.ORIGINS.length > 0 ? apiConfig.ORIGINS : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })

    setupSwagger(app, apiConfig)

    if (additionalFn) {
      additionalFn(app)
    }

    await app.listen(apiConfig.PORT)
  }

  async clusterize(nums: number = 2) {
    const processCount = Math.max(nums, cpus().length)
    if (cluster.isPrimary) {
      for (let i = 0; i < processCount - 1; i++) {
        cluster.fork()
      }
      cluster.on('exit', (worker, _code, _signal) => {
        console.log(`worker ${worker.process.pid} died. restaring`)
        cluster.fork()
      })
    } else {
      this.listen()
    }
  }
}

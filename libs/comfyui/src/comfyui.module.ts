import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter'
import { COMFYUI_CLIENT_TOKEN, ComfyUIClient } from './client'
import { COMFYUI_CONFIG_KEY, comfyuiConfig, IComfyUIConfig } from './config'
import { ComfyUIService } from './service'

@Module({
  imports: [
    ConfigModule.forFeature(comfyuiConfig),
    EventEmitterModule.forRoot({ global: false }),
  ],
  providers: [
    {
      provide: COMFYUI_CLIENT_TOKEN,
      inject: [ConfigService, EventEmitter2],
      // 최초 init 시 comfyUI Connect
      useFactory: async (
        configService: ConfigService,
        eventEmitter: EventEmitter2,
      ) => {
        const config =
          configService.getOrThrow<IComfyUIConfig>(COMFYUI_CONFIG_KEY)

        const client = new ComfyUIClient(eventEmitter, {
          host: config.HOST,
          port: config.PORT,
        })

        await client.connect()
        return client
      },
    },
    ComfyUIService,
  ],
  exports: [ComfyUIService],
})
export class ComfyUIModule {}

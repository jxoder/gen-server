import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { CommonModule } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { RedisModule } from '@slibs/redis'
import { RMQ_QUEUE, RmqModule } from '@slibs/rmq'
import { SettingsModule } from '@slibs/settings'
import { UserModule } from '@slibs/user'
import { AiImageControllerV1 } from './ai-image'
import { AuthController, EmailAccountController } from './auth'
import { SettingsController } from './settings'
import { TestController } from './test.controller'
import { UserControllerV1 } from './user'

@Module({
  imports: [
    CommonModule,
    ApiModule,
    DatabaseModule.forRoot(),
    RedisModule,
    UserModule,
    SettingsModule.forRoot(),
    RmqModule.registerClient(RMQ_QUEUE.GPU_SERVICE),
  ],
  controllers: [
    AuthController,
    EmailAccountController,
    UserControllerV1,
    SettingsController,
    TestController,
    AiImageControllerV1,
  ],
})
export class MainAppModule {}

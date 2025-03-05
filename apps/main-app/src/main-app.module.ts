import { Module } from '@nestjs/common'
import { ApiModule } from '@slibs/api'
import { CommonModule } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { RMQ_NAME, RmqModule } from '@slibs/rmq'
import { SettingsModule } from '@slibs/settings'
import { UserModule } from '@slibs/user'
import { AuthController, EmailAccountController } from './auth'
import { SettingsController } from './settings'
import { TestController } from './test.controller'
import { UserControllerV1 } from './user'

@Module({
  imports: [
    CommonModule,
    ApiModule,
    DatabaseModule.forRoot(),
    UserModule,
    SettingsModule.forRoot(),
    RmqModule.registerClient(RMQ_NAME.GPU_SERVICE),
  ],
  controllers: [
    AuthController,
    EmailAccountController,
    UserControllerV1,
    SettingsController,
    TestController,
  ],
})
export class MainAppModule {}

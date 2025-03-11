import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GmailClient, MockMailerClient } from './client'
import { IMailerConfig, MAILER_CONFIG_KEY, mailerConfig } from './config'
import { MAILER_CLIENT_TOKEN } from './constants'
import { MAILER_TYPE } from './types'

@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  providers: [
    {
      provide: MAILER_CLIENT_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config =
          configService.getOrThrow<IMailerConfig>(MAILER_CONFIG_KEY)
        switch (config.TYPE) {
          case MAILER_TYPE.MOCK:
            return new MockMailerClient()
          case MAILER_TYPE.GMAIL:
            return new GmailClient(config)
        }
      },
    },
  ],
  exports: [MAILER_CLIENT_TOKEN],
})
export class MailerModule {}

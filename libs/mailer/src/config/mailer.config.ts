import { registerAs } from '@nestjs/config'
import { get } from 'env-var'
import { MAILER_TYPE } from '../types'

export const MAILER_CONFIG_KEY = 'mailer'

export interface IMailerConfigBase {
  TYPE: MAILER_TYPE
}

export interface IMockConfig {
  TYPE: MAILER_TYPE.MOCK
}

export interface IGmailConfig {
  TYPE: MAILER_TYPE.GMAIL
  FROM: string
  GMAIL_USER: string
  GMAIL_PASSWORD: string
}

export type IMailerConfig = IMockConfig | IGmailConfig

export const mailerConfig = registerAs<IMailerConfig>(MAILER_CONFIG_KEY, () => {
  const type = get('MAILER_TYPE')
    .default(MAILER_TYPE.MOCK)
    .asEnum(Object.values(MAILER_TYPE))

  switch (type) {
    case MAILER_TYPE.MOCK:
      return {
        TYPE: type,
      }
    case MAILER_TYPE.GMAIL:
      return {
        TYPE: type,
        FROM: get('MAILER_GMAIL_FROM').required().asEmailString(),
        GMAIL_USER: get('MAILER_GMAIL_USER').required().asString(),
        GMAIL_PASSWORD: get('MAILER_GMAIL_PASSWORD').required().asString(),
      }
  }
})

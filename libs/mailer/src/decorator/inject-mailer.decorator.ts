import { Inject } from '@nestjs/common'
import { MAILER_CLIENT_TOKEN } from '../constants'

export const InjectMailer = (): ParameterDecorator =>
  Inject(MAILER_CLIENT_TOKEN)

import { applyDecorators } from '@nestjs/common'
import { ApiConsumes } from '@nestjs/swagger'
import { FormDataRequest } from 'nestjs-form-data'

export const ApiFormDataRequest = (): MethodDecorator =>
  applyDecorators(FormDataRequest(), ApiConsumes('multipart/form-data'))

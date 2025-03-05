import {
  BadRequestException,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data'
import path from 'path'
import { apiConfig } from './config'
import { HealthModule } from './health'
import { HttpExceptionFilter, RouteLoggerInterceptor } from './provider'

@Module({
  imports: [
    ConfigModule.forFeature(apiConfig),
    HealthModule,
    NestjsFormDataModule.config({
      isGlobal: true,
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
      storage: FileSystemStoredFile,
      fileSystemStoragePath: path.join(process.cwd(), '.tmp/uploads'),
    }),
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RouteLoggerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: true,
        exceptionFactory: errors => {
          return new BadRequestException(
            errors[0].constraints?.[Object.keys(errors[0].constraints)[0]],
          )
        },
      }),
    },
  ],
})
export class ApiModule {}

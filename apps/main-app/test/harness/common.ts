import { INestApplication } from '@nestjs/common'
import { ApiClient, initializeApplication } from '@slibs/testing'
import Redis from 'ioredis-mock'
import { DataSource } from 'typeorm'
import { MainAppModule } from '../../src/main-app.module'

jest.mock('ioredis', () => {
  return Redis
})

let app: INestApplication

export const ba = async () => {
  app = await initializeApplication(MainAppModule)
  await app.get(DataSource).synchronize()
}

export const aa = async () => {
  await app.get(DataSource).destroy()
  await app.close()
}

export const clearDatabase = async () => {
  await app.get(DataSource).synchronize(true)
  await app.get(Redis).flushall()
}

export const getApplication = () => {
  if (!app) {
    throw new Error(`require initalize app`)
  }
  return app
}

export const createClient = () => {
  return new ApiClient(getApplication())
}

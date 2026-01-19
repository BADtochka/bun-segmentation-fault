import { Logger } from '@nestjs/common'
import 'dotenv/config'

export type AppEnv = {
  ACCESS_TOKEN: string
  REFRESH_TOKEN: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppEnv {}
  }
}

export const parseEnv = <T extends keyof AppEnv>(envKey: T) => {
  const logger = new Logger('parseEnv')
  if (!(envKey in process.env)) {
    logger.error(`Not found env field ${envKey}. CHECK .env FILE!`)
    // throw new Error(`Not found env field ${envKey}. CHECK .env FILE!`)
  }

  return process.env[envKey]
}

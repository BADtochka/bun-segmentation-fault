import { Injectable, Logger } from '@nestjs/common'
import { randomBytes } from 'crypto'
import { appendFileSync, existsSync, readFileSync } from 'fs'
import path from 'path'

@Injectable()
export class EnvService {
  private logger = new Logger(EnvService.name)

  public constructor() {
    this.addTokenIfMissing('ACCESS_TOKEN', 32)
    this.addTokenIfMissing('REFRESH_TOKEN', 64)
  }

  envPath = path.resolve('.env')

  private generateToken(length: number): string {
    return randomBytes(length).toString('hex')
  }

  addTokenIfMissing(key: string, length: number) {
    let envContent = existsSync(this.envPath) ? readFileSync(this.envPath, 'utf8') : ''

    const regex = new RegExp(`^${key}=`, 'm')
    if (!regex.test(envContent)) {
      const token = this.generateToken(length)
      const line = `${key}=${token}`
      if (envContent && !envContent.endsWith('\n')) envContent += '\n'
      appendFileSync(this.envPath, `${line}\n`)
      this.logger.warn(`⚠️  Variable ${key} generated in .env. RESTART APP MANUALY!`)
    }
  }
}

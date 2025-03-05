import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export const COMFYUI_CONFIG_KEY = 'comfyui'

export interface IComfyUIConfig {
  HOST: string
  PORT: number
}

export const comfyuiConfig = registerAs(COMFYUI_CONFIG_KEY, () => ({
  HOST: get('COMFYUI_HOST').default('0.0.0.0').asString(),
  PORT: get('COMFYUI_PORT').default(8188).asPortNumber(),
}))

import { registerAs } from '@nestjs/config'
import { get } from 'env-var'

export const COMFYUI_CONFIG_KEY = 'comfyui'

export interface IComfyUIConfig {
  HOST?: string // 설정되어 있지 않으면 mock 모드로 동작.
  PORT: number
}

export const comfyuiConfig = registerAs(COMFYUI_CONFIG_KEY, () => ({
  HOST: get('COMFYUI_HOST').asString(),
  PORT: get('COMFYUI_PORT').default(8188).asPortNumber(),
}))

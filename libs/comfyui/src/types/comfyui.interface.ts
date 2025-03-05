type WS_EVENT_NAME = 'open' | 'close' | 'error' | 'message'

export type ComfyUIWsEvent = `comfyui.${WS_EVENT_NAME}`

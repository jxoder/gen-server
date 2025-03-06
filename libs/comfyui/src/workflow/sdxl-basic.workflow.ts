import { IsString } from 'class-validator'
import { ComfyWorkflowBase } from './comfy-workflow.base'

class SDXLBasicWorkflowPaylod {
  @IsString()
  prompt!: string
}

export class SDXLBasicWorkflow extends ComfyWorkflowBase<SDXLBasicWorkflowPaylod> {
  constructor() {
    super('sdxl-basic', SDXLBasicWorkflowPaylod)
  }

  template(payload: SDXLBasicWorkflowPaylod) {
    return {
      prompt: {
        '4': {
          inputs: { ckpt_name: 'SDXL/waiNSFWIllustrious_v110.safetensors' },
          class_type: 'CheckpointLoaderSimple',
          _meta: { title: '체크포인트 로드' },
        },
        '5': {
          inputs: { width: 1024, height: 1024, batch_size: 1 },
          class_type: 'EmptyLatentImage',
          _meta: { title: '빈 잠재 이미지' },
        },
        '6': {
          inputs: {
            text: payload.prompt,
            clip: ['4', 1],
          },
          class_type: 'CLIPTextEncode',
          _meta: { title: 'CLIP 텍스트 인코딩 (프롬프트)' },
        },
        '7': {
          inputs: {
            text: '(jpeg artifacts, 3d, unreal engine 5, unity, frizzy hair, hair split ends, red skin, nsfw, nudity, bad anatomy, bad perspective, bad proportions, bad aspect ratio, 2 faces, plate, glance, ball, looking up, looking to the side, looking down, looking left, looking right, extra digit, bad hands, bad fingers, 3 arm, 3 hands, 6 fingers, neck band, neckless, cleavage, bad anatomy, bad eyes, bad, ugly, watermark, text, overlay, error, username, artist name, getty images, cropped, logo, signature, frame, low quality, normal quality, missing fingers, extra digit, fewer digits, cropped, worst quality, blurry, black and white, 6 fingers:1.2)',
            clip: ['4', 1],
          },
          class_type: 'CLIPTextEncode',
          _meta: { title: 'CLIP 텍스트 인코딩 (프롬프트)' },
        },
        '10': {
          inputs: {
            seed:
              Math.floor(Math.random() * (100000000000 - 100000 + 1)) + 100000,
            steps: 15,
            cfg: 7,
            sampler_name: 'euler_ancestral',
            scheduler: 'karras',
            denoise: 1,
            preview_method: 'auto',
            vae_decode: 'true',
            model: ['4', 0],
            positive: ['6', 0],
            negative: ['7', 0],
            latent_image: ['5', 0],
            optional_vae: ['4', 2],
          },
          class_type: 'KSampler (Efficient)',
          _meta: { title: 'KSampler (Efficient)' },
        },
        '11': {
          inputs: { images: ['10', 5] },
          class_type: 'PreviewImage',
          _meta: { title: '이미지 미리보기' },
        },
      },
      extra_data: {
        extra_pnginfo: {
          workflow: {
            last_node_id: 11,
            last_link_id: 18,
            nodes: [
              {
                id: 5,
                type: 'EmptyLatentImage',
                pos: [515, 606],
                size: [315, 106],
                flags: {},
                order: 0,
                mode: 0,
                inputs: [],
                outputs: [
                  {
                    name: 'LATENT',
                    type: 'LATENT',
                    links: [18],
                    slot_index: 0,
                  },
                ],
                properties: {
                  cnr_id: 'comfy-core',
                  ver: '0.3.18',
                  'Node name for S&R': 'EmptyLatentImage',
                },
                widgets_values: [1024, 1024, 1],
              },
              {
                id: 7,
                type: 'CLIPTextEncode',
                pos: [413, 389],
                size: [425.27801513671875, 180.6060791015625],
                flags: {},
                order: 3,
                mode: 0,
                inputs: [{ name: 'clip', type: 'CLIP', link: 5 }],
                outputs: [
                  {
                    name: 'CONDITIONING',
                    type: 'CONDITIONING',
                    links: [16],
                    slot_index: 0,
                  },
                ],
                properties: {
                  cnr_id: 'comfy-core',
                  ver: '0.3.18',
                  'Node name for S&R': 'CLIPTextEncode',
                },
                widgets_values: [
                  '(jpeg artifacts, 3d, unreal engine 5, unity, frizzy hair, hair split ends, red skin, nsfw, nudity, bad anatomy, bad perspective, bad proportions, bad aspect ratio, 2 faces, plate, glance, ball, looking up, looking to the side, looking down, looking left, looking right, extra digit, bad hands, bad fingers, 3 arm, 3 hands, 6 fingers, neck band, neckless, cleavage, bad anatomy, bad eyes, bad, ugly, watermark, text, overlay, error, username, artist name, getty images, cropped, logo, signature, frame, low quality, normal quality, missing fingers, extra digit, fewer digits, cropped, worst quality, blurry, black and white, 6 fingers:1.2)',
                ],
              },
              {
                id: 6,
                type: 'CLIPTextEncode',
                pos: [415, 186],
                size: [422.84503173828125, 164.31304931640625],
                flags: {},
                order: 2,
                mode: 0,
                inputs: [{ name: 'clip', type: 'CLIP', link: 3 }],
                outputs: [
                  {
                    name: 'CONDITIONING',
                    type: 'CONDITIONING',
                    links: [17],
                    slot_index: 0,
                  },
                ],
                properties: {
                  cnr_id: 'comfy-core',
                  ver: '0.3.18',
                  'Node name for S&R': 'CLIPTextEncode',
                },
                widgets_values: [
                  '(solo:1.2), a ultrarealistic photo of \bslender korean idol girl with (red short hair:1.1) (looking at viewer and looking ahead:1.4) wearing (black rococo dress:1.2), (highly detailed eyes:1.3), masterpiece, best quality, 8k,',
                ],
              },
              {
                id: 11,
                type: 'PreviewImage',
                pos: [1355, 157],
                size: [446.5611267089844, 564.2247924804688],
                flags: {},
                order: 5,
                mode: 0,
                inputs: [{ name: 'images', type: 'IMAGE', link: 12 }],
                outputs: [],
                properties: {
                  cnr_id: 'comfy-core',
                  ver: '0.3.18',
                  'Node name for S&R': 'PreviewImage',
                },
                widgets_values: [],
              },
              {
                id: 4,
                type: 'CheckpointLoaderSimple',
                pos: [63, 460],
                size: [315, 98],
                flags: {},
                order: 1,
                mode: 0,
                inputs: [],
                outputs: [
                  { name: 'MODEL', type: 'MODEL', links: [13], slot_index: 0 },
                  { name: 'CLIP', type: 'CLIP', links: [3, 5], slot_index: 1 },
                  { name: 'VAE', type: 'VAE', links: [14], slot_index: 2 },
                ],
                properties: {
                  cnr_id: 'comfy-core',
                  ver: '0.3.18',
                  'Node name for S&R': 'CheckpointLoaderSimple',
                },
                widgets_values: ['SDXL/waiNSFWIllustrious_v110.safetensors'],
              },
              {
                id: 10,
                type: 'KSampler (Efficient)',
                pos: [856, 192],
                size: [325, 562],
                flags: {},
                order: 4,
                mode: 0,
                inputs: [
                  { name: 'model', type: 'MODEL', link: 13 },
                  { name: 'positive', type: 'CONDITIONING', link: 17 },
                  { name: 'negative', type: 'CONDITIONING', link: 16 },
                  { name: 'latent_image', type: 'LATENT', link: 18 },
                  { name: 'optional_vae', type: 'VAE', shape: 7, link: 14 },
                  { name: 'script', type: 'SCRIPT', shape: 7, link: null },
                ],
                outputs: [
                  { name: 'MODEL', type: 'MODEL', shape: 3, links: null },
                  {
                    name: 'CONDITIONING+',
                    type: 'CONDITIONING',
                    shape: 3,
                    links: null,
                  },
                  {
                    name: 'CONDITIONING-',
                    type: 'CONDITIONING',
                    shape: 3,
                    links: null,
                  },
                  { name: 'LATENT', type: 'LATENT', shape: 3, links: null },
                  { name: 'VAE', type: 'VAE', shape: 3, links: null },
                  {
                    name: 'IMAGE',
                    type: 'IMAGE',
                    shape: 3,
                    links: [12],
                    slot_index: 5,
                  },
                ],
                properties: {
                  cnr_id: 'efficiency-nodes-comfyui',
                  ver: '1.0.5',
                  'Node name for S&R': 'KSampler (Efficient)',
                },
                widgets_values: [
                  755364791807907,
                  null,
                  30,
                  7,
                  'euler_ancestral',
                  'karras',
                  1,
                  'auto',
                  'true',
                ],
                color: '#332233',
                bgcolor: '#553355',
                shape: 1,
              },
            ],
            links: [
              [3, 4, 1, 6, 0, 'CLIP'],
              [5, 4, 1, 7, 0, 'CLIP'],
              [12, 10, 5, 11, 0, 'IMAGE'],
              [13, 4, 0, 10, 0, 'MODEL'],
              [14, 4, 2, 10, 4, 'VAE'],
              [16, 7, 0, 10, 2, 'CONDITIONING'],
              [17, 6, 0, 10, 1, 'CONDITIONING'],
              [18, 5, 0, 10, 3, 'LATENT'],
            ],
            groups: [],
            config: {},
            extra: {
              ds: {
                scale: 1,
                offset: [-161.2287277343753, -159.59105429687474],
              },
            },
            version: 0.4,
          },
        },
      },
    }
  }
}

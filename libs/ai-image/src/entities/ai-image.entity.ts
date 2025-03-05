import { CommonEntity } from '@slibs/database'
import { Entity } from 'typeorm'

@Entity({ name: 'ai_image' })
export class AiImageEntity extends CommonEntity {
  // TODO: 이미지 정보. 공통 file 추상 엔티티 생성하여 상속받아 사용하는 것이 좋을듯.
}

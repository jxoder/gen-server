import { EntityColumn } from '../decorator'
import { AuditableEntity } from './auditable.entity'

export abstract class FileBaseEntity extends AuditableEntity {
  @EntityColumn({
    type: 'varchar',
    length: 36,
    comment: 'uniq id (uuid)',
    primary: true,
  })
  id!: string

  @EntityColumn({
    type: 'varchar',
    comment: 'original file name',
    nullable: false,
  })
  filename!: string

  @EntityColumn({
    type: 'varchar',
    length: 20,
    comment: 'encoding',
    nullable: false,
  })
  encoding!: string

  @EntityColumn({ type: 'varchar', comment: 'mime type', nullable: false })
  mimeType!: string

  @EntityColumn({
    type: 'bigint',
    comment: 'file size',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  size?: number
}

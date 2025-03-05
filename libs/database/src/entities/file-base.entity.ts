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
}

import { Column, Entity } from 'typeorm'

@Entity()
export class UserToken {
  @Column()
  id: string

  @Column()
  refreshToken: string
}

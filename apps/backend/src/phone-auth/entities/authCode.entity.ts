import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AuthCode {
  @PrimaryColumn()
  phoneNumber: string;

  @Column()
  code: string;
}

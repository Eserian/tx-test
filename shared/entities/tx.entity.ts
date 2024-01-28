import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tx {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' })
  blockNumber: number;

  @Column()
  from: string;

  @Column({ nullable: true })
  to: string;

  @Column({ type: 'numeric' })
  value: number;
}

import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @Column()
  userId: number;

  @Column()
  bikeId: number;

  @Column()
  resId: number;

  @Column()
  userName: string;

  @Column()
  rating: number;
}

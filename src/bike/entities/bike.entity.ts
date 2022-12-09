import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  color: string;

  @Column()
  location: string;

  @Column()
  avgRating: number;

  @Column()
  isAvailable: boolean;

  @Column()
  userId: number;
}

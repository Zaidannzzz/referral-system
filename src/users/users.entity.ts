import { Purchase } from '../purchases/purchases.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  referralCode: string;

  @ManyToOne(() => User, (user) => user.referrals, { nullable: true })
  referredBy: User;

  @OneToMany(() => User, (user) => user.referredBy)
  referrals: User[];

  @Column({ default: 0 })
  earnings: number;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}

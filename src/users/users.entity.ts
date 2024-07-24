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

  @ManyToOne(() => User, (user) => user.referrals)
  referredBy: User;

  @OneToMany(() => User, (user) => user.referredBy)
  referrals: User[];

  @Column({ default: 0 })
  earnings: number;
}

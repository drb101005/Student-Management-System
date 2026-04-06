import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import type { UserRole } from '../common/serializers/user.serializer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  role!: UserRole;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  phone!: string | null;

  @Column({ nullable: true })
  department!: string | null;

  @Column({ nullable: true })
  studentId!: string | null;

  @Column({ name: 'class_name', nullable: true })
  className!: string | null;

  @Column({ nullable: true })
  section!: string | null;

  @Column({ nullable: true })
  rollNumber!: string | null;

  @Column({ nullable: true })
  parentName!: string | null;

  @Column({ default: 'active', nullable: true })
  status!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt!: Date | null;
}

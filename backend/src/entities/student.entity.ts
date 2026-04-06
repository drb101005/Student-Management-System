import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  studentId!: string;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column({ name: 'class_name' })
  className!: string;

  @Column()
  section!: string;

  @Column()
  rollNumber!: string;

  @Column()
  parentName!: string;

  @Column({ default: 'active' })
  status!: string;

  @Column({ nullable: true })
  userId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

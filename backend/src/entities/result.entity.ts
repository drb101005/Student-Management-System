import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  studentId!: string;

  @Column()
  subject!: string;

  @Column('integer')
  marks!: number;

  @Column('integer')
  totalMarks!: number;

  @Column()
  examName!: string;

  @Column()
  grade!: string;

  @CreateDateColumn()
  createdAt!: Date;
}

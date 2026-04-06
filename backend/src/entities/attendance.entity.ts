import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryColumn()
  id!: string;

  @Column()
  studentId!: string;

  @Column()
  date!: string;

  @Column()
  status!: string;

  @UpdateDateColumn()
  updatedAt!: Date;
}

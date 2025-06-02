import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TimesheetStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('timesheets')
export class Timesheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  contractorId: string;

  @ManyToOne(() => User, (user) => user.timesheets)
  @JoinColumn({ name: 'contractorId' })
  contractor: User;

  @Column()
  projectName: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hoursWorked: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'date' })
  weekStartDate: Date;

  @Column({ type: 'date' })
  weekEndDate: Date;

  @Column({
    type: 'enum',
    enum: TimesheetStatus,
    default: TimesheetStatus.PENDING,
  })
  status: TimesheetStatus;

  @Column({ type: 'uuid', nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get weekRange(): string {
    return `${this.weekStartDate.toDateString()} - ${this.weekEndDate.toDateString()}`;
  }

  get isEditable(): boolean {
    return this.status === TimesheetStatus.PENDING;
  }
} 
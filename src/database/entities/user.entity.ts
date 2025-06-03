import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Timesheet } from './timesheet.entity';

export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  CONTRACTOR = 'contractor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONTRACTOR,
  })
  role: UserRole;

  @Column({ nullable: true })
  keycloakId: string;

  @Column({ default: true })
  isActive: boolean;

  // For recruiters - the contractors they manage
  @Column('uuid', { array: true, default: [] })
  managedContractorIds: string[];

  @OneToMany(() => Timesheet, (timesheet) => timesheet.contractor)
  timesheets: Timesheet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, Timesheet, TimesheetStatus } from '../entities';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Timesheet)
    private readonly timesheetRepository: Repository<Timesheet>,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.seedIfNeeded();
    } catch (error) {
      this.logger.error('Failed to run database seed:', error);
    }
  }

  private async isDatabaseSeeded(): Promise<boolean> {
    const adminCount = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    return adminCount > 0;
  }

  async seedIfNeeded(): Promise<void> {
    const isSeeded = await this.isDatabaseSeeded();
    
    if (isSeeded) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('🌱 Starting database seeding...');

    // Create sample users
    const admin = this.userRepository.create({
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      keycloakId: 'admin-keycloak-id',
    });

    const recruiter = this.userRepository.create({
      email: 'recruiter@example.com',
      firstName: 'Jane',
      lastName: 'Recruiter',
      role: UserRole.RECRUITER,
      keycloakId: 'recruiter-keycloak-id',
      managedContractorIds: [],
    });

    const contractor1 = this.userRepository.create({
      email: 'contractor1@example.com',
      firstName: 'John',
      lastName: 'Contractor',
      role: UserRole.CONTRACTOR,
      keycloakId: 'contractor1-keycloak-id',
    });

    const contractor2 = this.userRepository.create({
      email: 'contractor2@example.com',
      firstName: 'Alice',
      lastName: 'Developer',
      role: UserRole.CONTRACTOR,
      keycloakId: 'contractor2-keycloak-id',
    });

    // Save users
    await this.userRepository.save([admin, recruiter, contractor1, contractor2]);
    this.logger.log('✅ Users created successfully');

    // Update recruiter's managed contractors
    recruiter.managedContractorIds = [contractor1.id, contractor2.id];
    await this.userRepository.save(recruiter);
    this.logger.log('✅ Recruiter-contractor relationships established');

    // Create sample timesheets
    const timesheets = [
      this.timesheetRepository.create({
        contractorId: contractor1.id,
        projectName: 'E-commerce Website Development',
        hoursWorked: 40,
        notes: 'Completed user authentication module and started payment integration',
        weekStartDate: new Date('2024-01-01'),
        weekEndDate: new Date('2024-01-07'),
        status: TimesheetStatus.APPROVED,
        approvedBy: recruiter.id,
        approvedAt: new Date('2024-01-08'),
      }),
      this.timesheetRepository.create({
        contractorId: contractor1.id,
        projectName: 'E-commerce Website Development',
        hoursWorked: 38.5,
        notes: 'Finished payment integration and worked on order management system',
        weekStartDate: new Date('2024-01-08'),
        weekEndDate: new Date('2024-01-14'),
        status: TimesheetStatus.PENDING,
      }),
      this.timesheetRepository.create({
        contractorId: contractor2.id,
        projectName: 'Mobile App Development',
        hoursWorked: 35,
        notes: 'Developed user interface components and implemented navigation',
        weekStartDate: new Date('2024-01-01'),
        weekEndDate: new Date('2024-01-07'),
        status: TimesheetStatus.APPROVED,
        approvedBy: recruiter.id,
        approvedAt: new Date('2024-01-08'),
      }),
      this.timesheetRepository.create({
        contractorId: contractor2.id,
        projectName: 'Mobile App Development',
        hoursWorked: 42,
        notes: 'Integrated API endpoints and implemented data caching',
        weekStartDate: new Date('2024-01-08'),
        weekEndDate: new Date('2024-01-14'),
        status: TimesheetStatus.REJECTED,
        rejectionReason: 'Hours seem excessive for the described tasks',
      }),
      this.timesheetRepository.create({
        contractorId: contractor2.id,
        projectName: 'Mobile App Development',
        hoursWorked: 37,
        notes: 'Fixed bugs from previous week and optimized performance',
        weekStartDate: new Date('2024-01-15'),
        weekEndDate: new Date('2024-01-21'),
        status: TimesheetStatus.PENDING,
      }),
    ];

    await this.timesheetRepository.save(timesheets);
    this.logger.log('✅ Sample timesheets created successfully');

    this.logger.log('🎉 Database seeding completed!');
    this.logger.log('\n📋 Sample Users Created:');
    this.logger.log('👤 Admin: admin@example.com');
    this.logger.log('👤 Recruiter: recruiter@example.com');
    this.logger.log('👤 Contractor 1: contractor1@example.com');
    this.logger.log('👤 Contractor 2: contractor2@example.com');
  }
} 
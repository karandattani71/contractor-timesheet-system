import { DataSource } from 'typeorm';
import { User, UserRole, Timesheet, TimesheetStatus } from '../entities';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const timesheetRepository = dataSource.getRepository(Timesheet);

  console.log('🌱 Starting database seeding...');

  // Create sample users
  const admin = userRepository.create({
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    keycloakId: 'admin-keycloak-id',
  });

  const recruiter = userRepository.create({
    email: 'recruiter@example.com',
    firstName: 'Jane',
    lastName: 'Recruiter',
    role: UserRole.RECRUITER,
    keycloakId: 'recruiter-keycloak-id',
    managedContractorIds: [], // Will be updated after creating contractors
  });

  const contractor1 = userRepository.create({
    email: 'contractor1@example.com',
    firstName: 'John',
    lastName: 'Contractor',
    role: UserRole.CONTRACTOR,
    keycloakId: 'contractor1-keycloak-id',
  });

  const contractor2 = userRepository.create({
    email: 'contractor2@example.com',
    firstName: 'Alice',
    lastName: 'Developer',
    role: UserRole.CONTRACTOR,
    keycloakId: 'contractor2-keycloak-id',
  });

  // Save users
  await userRepository.save([admin, recruiter, contractor1, contractor2]);
  console.log('✅ Users created successfully');

  // Update recruiter's managed contractors
  recruiter.managedContractorIds = [contractor1.id, contractor2.id];
  await userRepository.save(recruiter);
  console.log('✅ Recruiter-contractor relationships established');

  // Create sample timesheets
  const timesheets = [
    // Contractor 1 timesheets
    timesheetRepository.create({
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
    timesheetRepository.create({
      contractorId: contractor1.id,
      projectName: 'E-commerce Website Development',
      hoursWorked: 38.5,
      notes: 'Finished payment integration and worked on order management system',
      weekStartDate: new Date('2024-01-08'),
      weekEndDate: new Date('2024-01-14'),
      status: TimesheetStatus.PENDING,
    }),
    // Contractor 2 timesheets
    timesheetRepository.create({
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
    timesheetRepository.create({
      contractorId: contractor2.id,
      projectName: 'Mobile App Development',
      hoursWorked: 42,
      notes: 'Integrated API endpoints and implemented data caching',
      weekStartDate: new Date('2024-01-08'),
      weekEndDate: new Date('2024-01-14'),
      status: TimesheetStatus.REJECTED,
      rejectionReason: 'Hours seem excessive for the described tasks',
    }),
    timesheetRepository.create({
      contractorId: contractor2.id,
      projectName: 'Mobile App Development',
      hoursWorked: 37,
      notes: 'Fixed bugs from previous week and optimized performance',
      weekStartDate: new Date('2024-01-15'),
      weekEndDate: new Date('2024-01-21'),
      status: TimesheetStatus.PENDING,
    }),
  ];

  await timesheetRepository.save(timesheets);
  console.log('✅ Sample timesheets created successfully');

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Sample Users Created:');
  console.log('👤 Admin: admin@example.com');
  console.log('👤 Recruiter: recruiter@example.com');
  console.log('👤 Contractor 1: contractor1@example.com');
  console.log('👤 Contractor 2: contractor2@example.com');
  console.log('\n🔐 For testing, use any password with these emails in the login endpoint');
} 
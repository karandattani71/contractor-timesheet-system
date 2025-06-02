import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, Timesheet } from '../entities';
import { seedDatabase } from './seed';

async function runSeed() {
  const configService = new ConfigService();
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST') || 'localhost',
    port: configService.get<number>('DB_PORT') || 5432,
    username: configService.get<string>('DB_USERNAME') || 'postgres',
    password: configService.get<string>('DB_PASSWORD') || 'postgres',
    database: configService.get<string>('DB_DATABASE') || 'timesheet_db',
    entities: [User, Timesheet],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('📦 Database connection established');
    
    await seedDatabase(dataSource);
    
    await dataSource.destroy();
    console.log('🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

runSeed(); 
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('DatabaseSeed');
  
  try {
    logger.log('🌱 Starting database seeding...');
    
    const app = await NestFactory.create(SeedModule);
    const seedService = app.get(SeedService);
    
    await seedService.seedIfNeeded();
    
    logger.log('✅ Database seeding completed successfully!');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

bootstrap(); 
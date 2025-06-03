import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Timesheet } from '../entities';
import { SeedService } from './seed.service';
import { getDatabaseConfig } from '../database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Timesheet]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {} 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Timesheet } from '../entities';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Timesheet]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {} 
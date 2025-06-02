import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Timesheet } from '../../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Timesheet])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {} 
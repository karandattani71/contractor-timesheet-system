import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timesheet } from '../../database/entities';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(Timesheet)
    private timesheetsRepository: Repository<Timesheet>,
  ) {}

  async exportTimesheets(format: 'csv' | 'json'): Promise<string> {
    this.logger.log(`Exporting timesheets in ${format.toUpperCase()} format`);
    
    const timesheets = await this.timesheetsRepository.find({
      relations: ['contractor'],
      order: { createdAt: 'DESC' },
    });

    if (format === 'json') {
      return this.exportAsJson(timesheets);
    } else {
      return this.exportAsCsv(timesheets);
    }
  }

  private exportAsJson(timesheets: Timesheet[]): string {
    const exportData = timesheets.map(timesheet => ({
      id: timesheet.id,
      contractorName: timesheet.contractor.fullName,
      contractorEmail: timesheet.contractor.email,
      projectName: timesheet.projectName,
      hoursWorked: timesheet.hoursWorked,
      notes: timesheet.notes,
      weekStartDate: timesheet.weekStartDate,
      weekEndDate: timesheet.weekEndDate,
      status: timesheet.status,
      approvedBy: timesheet.approvedBy,
      approvedAt: timesheet.approvedAt,
      rejectionReason: timesheet.rejectionReason,
      createdAt: timesheet.createdAt,
      updatedAt: timesheet.updatedAt,
    }));

    return JSON.stringify(exportData, null, 2);
  }

  private exportAsCsv(timesheets: Timesheet[]): string {
    const headers = [
      'ID',
      'Contractor Name',
      'Contractor Email',
      'Project Name',
      'Hours Worked',
      'Notes',
      'Week Start Date',
      'Week End Date',
      'Status',
      'Approved By',
      'Approved At',
      'Rejection Reason',
      'Created At',
      'Updated At',
    ];

    const csvRows = [headers.join(',')];

    timesheets.forEach(timesheet => {
      const row = [
        timesheet.id,
        `"${timesheet.contractor.fullName}"`,
        timesheet.contractor.email,
        `"${timesheet.projectName}"`,
        timesheet.hoursWorked,
        `"${timesheet.notes || ''}"`,
        timesheet.weekStartDate.toISOString().split('T')[0],
        timesheet.weekEndDate.toISOString().split('T')[0],
        timesheet.status,
        timesheet.approvedBy || '',
        timesheet.approvedAt ? timesheet.approvedAt.toISOString() : '',
        `"${timesheet.rejectionReason || ''}"`,
        timesheet.createdAt.toISOString(),
        timesheet.updatedAt.toISOString(),
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }
} 
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
    const exportData = timesheets.map((timesheet) => ({
      id: timesheet.id,
      contractorName: timesheet.contractor.fullName,
      contractorEmail: timesheet.contractor.email,
      projectName: timesheet.projectName,
      hoursWorked: timesheet.hoursWorked,
      notes: timesheet.notes,
      weekStartDate: this.formatDate(timesheet.weekStartDate),
      weekEndDate: this.formatDate(timesheet.weekEndDate),
      status: timesheet.status,
      approvedBy: timesheet.approvedBy,
      approvedAt: timesheet.approvedAt ? this.formatDateTime(timesheet.approvedAt) : null,
      rejectionReason: timesheet.rejectionReason,
      createdAt: this.formatDateTime(timesheet.createdAt),
      updatedAt: this.formatDateTime(timesheet.updatedAt),
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

    timesheets.forEach((timesheet) => {
      const row = [
        timesheet.id,
        `"${timesheet.contractor.fullName}"`,
        timesheet.contractor.email,
        `"${timesheet.projectName}"`,
        timesheet.hoursWorked,
        `"${timesheet.notes || ''}"`,
        this.formatDate(timesheet.weekStartDate),
        this.formatDate(timesheet.weekEndDate),
        timesheet.status,
        timesheet.approvedBy || '',
        timesheet.approvedAt ? this.formatDateTime(timesheet.approvedAt) : '',
        `"${timesheet.rejectionReason || ''}"`,
        this.formatDateTime(timesheet.createdAt),
        this.formatDateTime(timesheet.updatedAt),
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  /**
   * Helper method to format date fields (handles both Date objects and string dates)
   */
  private formatDate(dateValue: Date | string): string {
    if (!dateValue) return '';
    
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // If it's a string, try to parse it
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      // If parsing fails, return the original string
      return String(dateValue);
    }
    
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper method to format datetime fields (handles both Date objects and string dates)
   */
  private formatDateTime(dateValue: Date | string): string {
    if (!dateValue) return '';
    
    if (dateValue instanceof Date) {
      return dateValue.toISOString();
    }
    
    // If it's a string, try to parse it
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      // If parsing fails, return the original string
      return String(dateValue);
    }
    
    return date.toISOString();
  }
}

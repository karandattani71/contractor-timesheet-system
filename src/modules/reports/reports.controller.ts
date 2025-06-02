import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../database/entities';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('export')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Export all timesheets (Admin only)' })
  @ApiQuery({
    name: 'format',
    enum: ['csv', 'json'],
    description: 'Export format',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Timesheets exported successfully',
    content: {
      'text/csv': {
        schema: { type: 'string' },
      },
      'application/json': {
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async exportTimesheets(
    @Query('format') format: 'csv' | 'json' = 'csv',
    @Res() res: Response,
  ) {
    const data = await this.reportsService.exportTimesheets(format);
    
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `timesheets-export-${timestamp}.${format}`;
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    }
    
    res.send(data);
  }
} 
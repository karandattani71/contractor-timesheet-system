import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveTimesheetDto {
  @ApiPropertyOptional({
    description: 'Optional approval notes',
    example: 'Approved - good work this week',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectTimesheetDto {
  @ApiPropertyOptional({
    description: 'Reason for rejection',
    example: 'Hours seem excessive for the tasks described',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

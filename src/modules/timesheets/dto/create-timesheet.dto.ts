import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTimesheetDto {
  @ApiProperty({
    description: 'Project name',
    example: 'E-commerce Website Development',
  })
  @IsString()
  projectName: string;

  @ApiProperty({
    description: 'Hours worked (up to 2 decimal places)',
    example: 40.5,
    minimum: 0.01,
    maximum: 168,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(168) // Maximum hours in a week
  hoursWorked: number;

  @ApiPropertyOptional({
    description: 'Optional notes about the work done',
    example:
      'Completed user authentication module and started on payment integration',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Week start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsDateString()
  weekStartDate: string;

  @ApiProperty({
    description: 'Week end date (YYYY-MM-DD)',
    example: '2024-01-07',
  })
  @IsDateString()
  weekEndDate: string;
}

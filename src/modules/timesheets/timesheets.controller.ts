import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TimesheetsService } from './timesheets.service';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import {
  ApproveTimesheetDto,
  RejectTimesheetDto,
} from './dto/approve-timesheet.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { UserRole, User } from '../../database/entities';

@ApiTags('Timesheets')
@Controller('timesheets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Post()
  @Roles(UserRole.CONTRACTOR)
  @ApiOperation({ summary: 'Create a new timesheet (Contractor only)' })
  @ApiResponse({ status: 201, description: 'Timesheet created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - timesheet already exists for this week',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Contractor access required',
  })
  create(
    @Body() createTimesheetDto: CreateTimesheetDto,
    @CurrentUser() user: User,
  ) {
    return this.timesheetsService.create(createTimesheetDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get timesheets with pagination (role-based filtering)',
  })
  @ApiResponse({
    status: 200,
    description: 'Timesheets retrieved successfully',
  })
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() user: User,
  ) {
    return this.timesheetsService.findAll(paginationQuery, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get timesheet by ID (with role-based access control)',
  })
  @ApiResponse({ status: 200, description: 'Timesheet found' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.timesheetsService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.CONTRACTOR)
  @ApiOperation({
    summary: 'Update timesheet (Contractor only, pending timesheets only)',
  })
  @ApiResponse({ status: 200, description: 'Timesheet updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - can only update pending timesheets',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only update own timesheets',
  })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  update(
    @Param('id') id: string,
    @Body() updateTimesheetDto: UpdateTimesheetDto,
    @CurrentUser() user: User,
  ) {
    return this.timesheetsService.update(id, updateTimesheetDto, user);
  }

  @Patch(':id/approve')
  @Roles(UserRole.RECRUITER)
  @ApiOperation({ summary: 'Approve timesheet (Recruiter only)' })
  @ApiResponse({ status: 200, description: 'Timesheet approved successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - can only approve pending timesheets',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Recruiter access required',
  })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveTimesheetDto,
    @CurrentUser() user: User,
  ) {
    return this.timesheetsService.approve(id, approveDto, user);
  }

  @Patch(':id/reject')
  @Roles(UserRole.RECRUITER)
  @ApiOperation({ summary: 'Reject timesheet (Recruiter only)' })
  @ApiResponse({ status: 200, description: 'Timesheet rejected successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - can only reject pending timesheets',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Recruiter access required',
  })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  reject(
    @Param('id') id: string,
    @Body() rejectDto: RejectTimesheetDto,
    @CurrentUser() user: User,
  ) {
    return this.timesheetsService.reject(id, rejectDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.CONTRACTOR)
  @ApiOperation({
    summary: 'Delete timesheet (Contractor only, pending timesheets only)',
  })
  @ApiResponse({ status: 200, description: 'Timesheet deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request - can only delete pending timesheets',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - can only delete own timesheets',
  })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.timesheetsService.remove(id, user);
  }
}

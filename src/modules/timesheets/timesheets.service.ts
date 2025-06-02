import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Timesheet, TimesheetStatus, User, UserRole } from '../../database/entities';
import { CreateTimesheetDto } from './dto/create-timesheet.dto';
import { UpdateTimesheetDto } from './dto/update-timesheet.dto';
import { ApproveTimesheetDto, RejectTimesheetDto } from './dto/approve-timesheet.dto';
import { PaginationQueryDto, PaginationResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TimesheetsService {
  private readonly logger = new Logger(TimesheetsService.name);

  constructor(
    @InjectRepository(Timesheet)
    private timesheetsRepository: Repository<Timesheet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createTimesheetDto: CreateTimesheetDto, contractorId: string): Promise<Timesheet> {
    this.logger.log(`Creating timesheet for contractor: ${contractorId}`);
    
    // Check if timesheet already exists for this week
    const existingTimesheet = await this.timesheetsRepository.findOne({
      where: {
        contractorId,
        weekStartDate: new Date(createTimesheetDto.weekStartDate),
        weekEndDate: new Date(createTimesheetDto.weekEndDate),
      },
    });

    if (existingTimesheet) {
      throw new BadRequestException('Timesheet already exists for this week');
    }

    const timesheet = this.timesheetsRepository.create({
      ...createTimesheetDto,
      contractorId,
      weekStartDate: new Date(createTimesheetDto.weekStartDate),
      weekEndDate: new Date(createTimesheetDto.weekEndDate),
    });

    return this.timesheetsRepository.save(timesheet);
  }

  async findAll(paginationQuery: PaginationQueryDto, user: User): Promise<PaginationResponseDto<Timesheet>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    let whereCondition = {};

    // Apply role-based filtering
    if (user.role === UserRole.CONTRACTOR) {
      whereCondition = { contractorId: user.id };
    } else if (user.role === UserRole.RECRUITER) {
      whereCondition = { contractorId: In(user.managedContractorIds) };
    }
    // Admin can see all timesheets (no additional filtering)

    const [timesheets, total] = await this.timesheetsRepository.findAndCount({
      where: whereCondition,
      relations: ['contractor'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    this.logger.log(`Retrieved ${timesheets.length} timesheets for user ${user.email} (page ${page})`);
    return new PaginationResponseDto(timesheets, total, page, limit);
  }

  async findOne(id: string, user: User): Promise<Timesheet> {
    const timesheet = await this.timesheetsRepository.findOne({
      where: { id },
      relations: ['contractor'],
    });

    if (!timesheet) {
      throw new NotFoundException(`Timesheet with ID ${id} not found`);
    }

    // Check access permissions
    if (user.role === UserRole.CONTRACTOR && timesheet.contractorId !== user.id) {
      throw new ForbiddenException('You can only access your own timesheets');
    }

    if (user.role === UserRole.RECRUITER && !user.managedContractorIds.includes(timesheet.contractorId)) {
      throw new ForbiddenException('You can only access timesheets of contractors you manage');
    }

    return timesheet;
  }

  async update(id: string, updateTimesheetDto: UpdateTimesheetDto, user: User): Promise<Timesheet> {
    const timesheet = await this.findOne(id, user);

    // Only contractors can update their own timesheets and only if pending
    if (user.role !== UserRole.CONTRACTOR || timesheet.contractorId !== user.id) {
      throw new ForbiddenException('You can only update your own timesheets');
    }

    if (timesheet.status !== TimesheetStatus.PENDING) {
      throw new BadRequestException('You can only update pending timesheets');
    }

    this.logger.log(`Updating timesheet ${id} by contractor ${user.id}`);
    
    await this.timesheetsRepository.update(id, {
      ...updateTimesheetDto,
      weekStartDate: updateTimesheetDto.weekStartDate ? new Date(updateTimesheetDto.weekStartDate) : undefined,
      weekEndDate: updateTimesheetDto.weekEndDate ? new Date(updateTimesheetDto.weekEndDate) : undefined,
    });

    return this.findOne(id, user);
  }

  async approve(id: string, approveDto: ApproveTimesheetDto, user: User): Promise<Timesheet> {
    const timesheet = await this.findOne(id, user);

    if (user.role !== UserRole.RECRUITER) {
      throw new ForbiddenException('Only recruiters can approve timesheets');
    }

    if (timesheet.status !== TimesheetStatus.PENDING) {
      throw new BadRequestException('Only pending timesheets can be approved');
    }

    this.logger.log(`Approving timesheet ${id} by recruiter ${user.id}`);

    await this.timesheetsRepository.update(id, {
      status: TimesheetStatus.APPROVED,
      approvedBy: user.id,
      approvedAt: new Date(),
      notes: approveDto.notes || timesheet.notes,
    });

    return this.findOne(id, user);
  }

  async reject(id: string, rejectDto: RejectTimesheetDto, user: User): Promise<Timesheet> {
    const timesheet = await this.findOne(id, user);

    if (user.role !== UserRole.RECRUITER) {
      throw new ForbiddenException('Only recruiters can reject timesheets');
    }

    if (timesheet.status !== TimesheetStatus.PENDING) {
      throw new BadRequestException('Only pending timesheets can be rejected');
    }

    this.logger.log(`Rejecting timesheet ${id} by recruiter ${user.id}`);

    await this.timesheetsRepository.update(id, {
      status: TimesheetStatus.REJECTED,
      rejectionReason: rejectDto.rejectionReason,
    });

    return this.findOne(id, user);
  }

  async remove(id: string, user: User): Promise<void> {
    const timesheet = await this.findOne(id, user);

    // Only contractors can delete their own pending timesheets
    if (user.role !== UserRole.CONTRACTOR || timesheet.contractorId !== user.id) {
      throw new ForbiddenException('You can only delete your own timesheets');
    }

    if (timesheet.status !== TimesheetStatus.PENDING) {
      throw new BadRequestException('You can only delete pending timesheets');
    }

    this.logger.log(`Deleting timesheet ${id} by contractor ${user.id}`);
    await this.timesheetsRepository.delete(id);
  }
} 
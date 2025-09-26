import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AssignDto, CreateTicketDto, UpdateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
import { CommentsService } from '../comments/comments.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(
    private tickets: TicketsService,
    private comments: CommentsService,
  ) {}

  @Post('tickets')
  @Roles('user', 'admin')
  create(
    @Req() req,
    @Body(new ZodValidationPipe(CreateTicketDto)) dto: CreateTicketDto,
  ) {
    return this.tickets.createTicket({ ...dto, created_by: req.user.id });
  }

  @Get('tickets')
  @Roles('user', 'admin')
  async list(
    @Req() req,
    @Query('q') q?: string,
    @Query('status') status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.tickets.listTickets(
      q,
      status as any,
      Number(page),
      Number(limit),
      req.user,
    );
  }

  @Get('tickets/:id')
  @Roles('user', 'admin')
  get(@Req() req, @Param('id') id: string) {
    return this.tickets.getTicket(Number(id), req.user);
  }

  @Patch('tickets/:id')
  @Roles('user', 'admin')
  update(
    @Req() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTicketDto)) dto: any,
  ) {
    return this.tickets.updateTicket(Number(id), dto, req.user);
  }

  @Put('tickets/:id/assign')
  @Roles('admin')
  assign(
    @Req() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AssignDto)) dto: { assigned_to: number },
  ) {
    return this.tickets.assignTicket(Number(id), dto.assigned_to, req.user);
  }

  // Comments (Mongo)
  @Post('tickets/:id/comments')
  @Roles('user', 'admin')
  addComment(
    @Req() req,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(z.object({ body: z.string().min(1) })))
    dto: { body: string },
  ): Promise<any> {
    return this.comments.addComment(Number(id), req.user.id, dto.body);
  }

  @Get('tickets/:id/comments')
  @Roles('user', 'admin')
  listComments(@Req() req, @Param('id') id: string): Promise<any[]> {
    return this.tickets
      .getTicket(Number(id), req.user)
      .then(() => this.comments.listComments(Number(id)));
  }
}

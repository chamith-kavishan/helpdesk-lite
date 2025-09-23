import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { ZodValidationPipe } from '../common/zod.pipe';
import { AssignDto, CreateTicketDto, UpdateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
import { CommentsService } from '../comments/comments.service';
import { z } from 'zod';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
  constructor(private tickets: TicketsService, private comments: CommentsService) {}

  @Post('tickets')
  @Roles('user','admin')
  @UsePipes(new ZodValidationPipe(CreateTicketDto))
  create(@Req() req, @Body() dto: CreateTicketDto) {
    return this.tickets.createTicket({ ...dto, created_by: req.user.id });
  }

  @Get('tickets')
  @Roles('user','admin')
  list(
    @Req() req,
    @Query('q') q?: string,
    @Query('status') status?: 'OPEN'|'IN_PROGRESS'|'RESOLVED',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.tickets.listTickets(q, status, Number(page), Number(limit), req.user);
  }

  @Get('tickets/:id')
  @Roles('user','admin')
  get(@Req() req, @Param('id') id: string) {
    return this.tickets.getTicket(Number(id), req.user);
  }

  @Patch('tickets/:id')
  @Roles('user','admin')
  @UsePipes(new ZodValidationPipe(UpdateTicketDto))
  update(@Req() req, @Param('id') id: string, @Body() dto: any) {
    return this.tickets.updateTicket(Number(id), dto, req.user);
  }

  @Put('tickets/:id/assign')
  @Roles('admin')
  @UsePipes(new ZodValidationPipe(AssignDto))
  assign(@Req() req, @Param('id') id: string, @Body() dto: { assigned_to:number }) {
    return this.tickets.assignTicket(Number(id), dto.assigned_to, req.user);
  }

  // Comments (Mongo)
  @Post('tickets/:id/comments')
  @Roles('user','admin')
  @UsePipes(new ZodValidationPipe(z.object({ body: z.string().min(1) }))))
  addComment(@Req() req, @Param('id') id: string, @Body() dto: { body:string }) {
    return this.comments.addComment(Number(id), req.user.id, dto.body);
  }

  @Get('tickets/:id/comments')
  @Roles('user','admin')
  listComments(@Req() req, @Param('id') id: string) {
    // getTicket enforces access rights
    return this.tickets.getTicket(Number(id), req.user).then(() => this.comments.listComments(Number(id)));
  }
}

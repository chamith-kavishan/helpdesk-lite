import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { CommentsService } from '../comments/comments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../mongo/schemas/comment.schema';
import { Event, EventSchema } from '../mongo/schemas/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, CommentsService],
})
export class TicketsModule {}

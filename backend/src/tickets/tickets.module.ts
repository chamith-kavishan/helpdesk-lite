import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { CommentsService } from '../comments/comments.service';
import { Comment, CommentSchema } from '../mongo/schemas/comment.schema';
import { Event, EventSchema } from '../mongo/schemas/event.schema';
import { CommentsGateway } from '../realtime/comments.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [TicketsController],
  providers: [TicketsService, CommentsService, CommentsGateway],
})
export class TicketsModule {}

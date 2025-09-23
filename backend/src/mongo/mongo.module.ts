import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { Event, EventSchema } from './schemas/event.schema';
import { MongoInitService } from './mongo-init.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  providers: [MongoInitService],
  exports: [MongooseModule],
})
export class MongoModule {}

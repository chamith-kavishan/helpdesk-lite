import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class MongoInitService implements OnModuleInit {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}
  async onModuleInit() {
    await Promise.all([this.commentModel.init(), this.eventModel.init()]);
  }
}

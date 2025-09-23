import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../mongo/schemas/comment.schema';
import { Event, EventDocument } from '../mongo/schemas/event.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
  ) {}

  async addComment(ticketId: number, authorId: number, body: string) {
    const c = await this.commentModel.create({ ticketId, authorId, body });
    await this.eventModel.create({
      type: 'COMMENT_ADDED',
      ticketId,
      actorId: authorId,
      payload: {},
    });
    return c;
  }

  async listComments(ticketId: number, limit = 50) {
    return this.commentModel
      .find({ ticketId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
  }
}

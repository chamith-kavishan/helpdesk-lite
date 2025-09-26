import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RowDataPacket } from 'mysql2';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from '../mongo/schemas/comment.schema';
import { Event, EventDocument } from '../mongo/schemas/event.schema';
import { CommentsGateway } from '../realtime/comments.gateway';
import { pool } from '../db/mysql';

interface UserRow extends RowDataPacket {
  id: number;
  name: string | null;
  email: string;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly commentsGateway: CommentsGateway,
  ) {}

  async addComment(ticketId: number, authorId: number, body: string) {
    const c = await this.commentModel.create({ ticketId, authorId, body });
    await this.eventModel.create({
      type: 'COMMENT_ADDED',
      ticketId,
      actorId: authorId,
      payload: {},
    });

    const [userRows] = await pool.query<UserRow[]>(
      'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
      [authorId],
    );
    const user = userRows[0] || null;

    const dto = {
      _id: c._id,
      ticketId,
      authorId,
      body,
      createdAt: c.createdAt,
      user,
    };

    this.commentsGateway.emitNewComment(ticketId, dto);
    return dto;
  }

  async listComments(ticketId: number, limit = 50) {
    const comments = await this.commentModel
      .find({ ticketId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    if (!comments.length) return [];

    const userIds = Array.from(new Set(comments.map((c) => c.authorId)));

    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, name, email FROM users WHERE id IN (?)',
      [userIds],
    );

    const userMap = new Map<number, UserRow>(rows.map((u) => [u.id, u]));

    return comments.map((c) => ({
      ...c,
      user: userMap.get(c.authorId) || null,
    }));
  }
}

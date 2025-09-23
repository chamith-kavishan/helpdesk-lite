import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
  @Prop({ required: true }) ticketId: number;
  @Prop({ required: true }) authorId: number;
  @Prop({ required: true }) body: string;

  createdAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ ticketId: 1, createdAt: -1 });

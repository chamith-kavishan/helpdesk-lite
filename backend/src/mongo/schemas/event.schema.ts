import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Event {
  @Prop({
    required: true,
    enum: ['TICKET_CREATED', 'ASSIGNED', 'STATUS_CHANGED', 'COMMENT_ADDED'],
  })
  type: 'TICKET_CREATED' | 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED';

  @Prop({ required: true }) ticketId: number;
  @Prop({ required: true }) actorId: number;
  @Prop({ type: Object, default: {} }) payload: Record<string, any>;

  createdAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

EventSchema.index({ ticketId: 1, createdAt: -1 });

import { HydratedDocument } from 'mongoose';
export type EventDocument = HydratedDocument<Event>;
export declare class Event {
    type: 'TICKET_CREATED' | 'ASSIGNED' | 'STATUS_CHANGED' | 'COMMENT_ADDED';
    ticketId: number;
    actorId: number;
    payload: Record<string, any>;
    createdAt: Date;
}
export declare const EventSchema: import("mongoose").Schema<Event, import("mongoose").Model<Event, any, any, any, import("mongoose").Document<unknown, any, Event, any, {}> & Event & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Event, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Event>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Event> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

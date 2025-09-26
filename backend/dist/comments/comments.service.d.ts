import { Comment, CommentDocument } from '../mongo/schemas/comment.schema';
import { EventDocument } from '../mongo/schemas/event.schema';
import { Model } from 'mongoose';
import { CommentsGateway } from 'src/realtime/comments.gateway';
export declare class CommentsService {
    private readonly commentModel;
    private readonly eventModel;
    private readonly commentsGateway;
    constructor(commentModel: Model<CommentDocument>, eventModel: Model<EventDocument>, commentsGateway: CommentsGateway);
    addComment(ticketId: number, authorId: number, body: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    listComments(ticketId: number, limit?: number): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Comment, {}, {}> & Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}

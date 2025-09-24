import { CreateTicketDto } from './dto';
import { TicketsService } from './tickets.service';
import { CommentsService } from '../comments/comments.service';
export declare class TicketsController {
    private tickets;
    private comments;
    constructor(tickets: TicketsService, comments: CommentsService);
    create(req: any, dto: CreateTicketDto): Promise<{
        status: string;
        title: string;
        description: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        created_by: number;
        id: number;
    }>;
    list(req: any, q?: string, status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED', page?: string, limit?: string): Promise<any>;
    get(req: any, id: string): Promise<any>;
    update(req: any, id: string, dto: any): Promise<any>;
    assign(req: any, id: string, dto: {
        assigned_to: number;
    }): Promise<any>;
    addComment(req: any, id: string, dto: {
        body: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../mongo/schemas/comment.schema").Comment, {}, {}> & import("../mongo/schemas/comment.schema").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../mongo/schemas/comment.schema").Comment, {}, {}> & import("../mongo/schemas/comment.schema").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    listComments(req: any, id: string): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../mongo/schemas/comment.schema").Comment, {}, {}> & import("../mongo/schemas/comment.schema").Comment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}

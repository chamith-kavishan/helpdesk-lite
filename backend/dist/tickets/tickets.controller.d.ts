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
    list(req: any, q?: string, status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED', page?: string, limit?: string): Promise<{
        items: any[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    get(req: any, id: string): Promise<any>;
    update(req: any, id: string, dto: any): Promise<any>;
    assign(req: any, id: string, dto: {
        assigned_to: number;
    }): Promise<any>;
    addComment(req: any, id: string, dto: {
        body: string;
    }): Promise<any>;
    listComments(req: any, id: string): Promise<any[]>;
}

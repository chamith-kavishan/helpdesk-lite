import { Model } from 'mongoose';
import { EventDocument } from '../mongo/schemas/event.schema';
import { Role } from 'src/common/roles.decorator';
export declare class TicketsService {
    private readonly eventModel;
    constructor(eventModel: Model<EventDocument>);
    createTicket(data: {
        title: string;
        description: string;
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        created_by: number;
    }): Promise<{
        status: string;
        title: string;
        description: string;
        priority: "LOW" | "MEDIUM" | "HIGH";
        created_by: number;
        id: number;
    }>;
    getTicket(id: number, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
    listTickets(q: string | undefined, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | undefined, page: number | undefined, limit: number | undefined, user: {
        id: number;
        role: Role;
    }): Promise<{
        items: any[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    updateTicket(id: number, partial: any, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
    assignTicket(id: number, assigned_to: number, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
}

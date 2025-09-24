import { Model } from 'mongoose';
import { EventDocument } from '../mongo/schemas/event.schema';
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
    listTickets(q: string | undefined, status: string | undefined, page: number | undefined, limit: number | undefined, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
    updateTicket(id: number, partial: any, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
    assignTicket(id: number, assigned_to: number, user: {
        id: number;
        role: 'user' | 'admin';
    }): Promise<any>;
}

import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(): void;
    onJoin(client: Socket, data: {
        ticketId: number;
    }): void;
    onLeave(client: Socket, data: {
        ticketId: number;
    }): void;
    room(ticketId: number): string;
    emitNewComment(ticketId: number, comment: any): void;
}

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

// Allow your frontend origin
@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  path: '/ws', // optional, helps avoid clashes with HTTP
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Expect token in connection auth payload
    const token = client.handshake.auth?.token as string | undefined;
    try {
      if (!token) throw new Error('No token');
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      (client as any).user = payload;
    } catch {
      client.disconnect(true);
      return;
    }
  }

  handleDisconnect() {}

  // Client asks to join a ticket room
  @SubscribeMessage('ticket:join')
  onJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: number },
  ) {
    client.join(this.room(data.ticketId));
  }

  @SubscribeMessage('ticket:leave')
  onLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { ticketId: number },
  ) {
    client.leave(this.room(data.ticketId));
  }

  // Helper to target a room
  room(ticketId: number) {
    return `ticket:${ticketId}`;
  }

  // Called by services when a new comment is added
  emitNewComment(ticketId: number, comment: any) {
    this.server.to(this.room(ticketId)).emit('comment:new', comment);
  }
}

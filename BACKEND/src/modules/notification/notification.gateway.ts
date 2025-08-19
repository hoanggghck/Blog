import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
  } from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { checkAccessTokenExpired, checkRefreshTokenValid } from 'src/utils/checkAuthen';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../token/entities/token.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { MyLogger } from 'src/logger/my.log';
  
  @WebSocketGateway({
    namespace: "notifications",
  })
  @Injectable()
  export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    io: Namespace;

    constructor(
        private readonly logger: MyLogger,
        private readonly jwtService: JwtService,
        @InjectRepository(Token)
        private readonly tokenRepo: Repository<Token>,
    ) {}
    afterInit(): void {
        this.logger.log(`Websocket Gateway intilized`, 'NotificationGateway');
    }

    // chỉ dùng được khi gắn headers 
    async handleConnection(client: Socket) {
        try {
            let accessToken =
            (client.handshake.auth?.token as string) ||
            (client.handshake.headers['authorization'] as string);
            const refreshToken = client.handshake.headers['refreshtoken'] as string;

            if (!accessToken || !refreshToken) {
                console.log('⛔ Missing tokens -> disconnect');
                client.disconnect(true); // <- chặn luôn, không cho kết nối
                return;
            }

            if (accessToken.startsWith('Bearer ')) {
                accessToken = accessToken.split(' ')[1];
            }

            await checkRefreshTokenValid(this.jwtService, accessToken, refreshToken, this.tokenRepo);
            const payload = await checkAccessTokenExpired(this.jwtService, accessToken, {});
            if (!payload) {
                throw new ForbiddenException('Thiếu thông tin payload');
            }
            console.log(`✅ Socket connected: ${client.id} (userId: ${payload.sub})`);
        } catch (e) {
            console.log(`🚫 Socket unauthorized: ${client.id}`, e.message);
            client.disconnect();
        }
    }

    handleDisconnect(socket: Socket) {
      console.log(`❌ Client disconnected: ${socket.id}`);
    }

    sendNotificationToUser(userId: string, message: string) {
      this.io.to(userId).emit('notification', { message });
    }
  
    @SubscribeMessage('join')
    handleJoin(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
      client.join(userId);
      return { event: 'joined', room: userId };
    }


    // method để service khác gọi
    notifyUser(userId: string, payload: any) {
        console.log(`📡 Emitting to user ${userId}:`, payload);
        this.io.to(userId).emit('notification', payload);
    }
}
  
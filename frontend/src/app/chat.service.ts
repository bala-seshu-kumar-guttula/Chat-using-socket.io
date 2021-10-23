import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from './chat/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket!: Socket;
  message = new Subject<Message>();
  message$  = this.message.asObservable();

  constructor() { }

  // For establishing a connection with socket.io
  async establishConnection(roomId: string): Promise<any> {
    try {
      this.socket = await io("", {
        query: {
          roomId
        }
      });
    } catch (error) {
      console.log("error in establising error", error);
    }
  }

  // send message from client using emit
  emitMessage(message: Message) {
    this.socket.emit('message', message);
  }

  // listening to the broadcast from backend
  listenToBroadcast(): Observable<Message>{
    this.socket.on('message', (message) => {
      this.message.next(message);
    });
    return this.message$;
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket!: Socket;
  message = new Subject<string>();
  message$  = this.message.asObservable();

  constructor(private http: HttpClient) { }

  async establishConnection(roomId: string): Promise<any> {
    try {
      this.socket = await io("http://localhost:3000", {
        query: {
          roomId
        }
      });
    } catch (error) {
      console.log("error in establising error", error);
    }
  }

  emitMessage(message: any) {
    this.socket.emit('message', message);
  }

  listenToBroadcast(): Observable<any>{
    let messageData = "";
    this.socket.on('message', (message) => {
      // console.log("message from backend", message);
      this.message.next(message);
      // return message;
      // messageData = message;
      // return message;
    });
    return this.message$;
  }

}

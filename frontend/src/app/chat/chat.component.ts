import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messageFormControl = new FormControl('', [Validators.required]);
  chat: any[] = [];

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.establishConnection("123").then(() => {
      const text = this.chatService.listenToBroadcast().subscribe((text) => {
        this.chat.push(text);
        console.log("from backend", this.chat);
      });
      // if(text.length > 0) {
      //   const message = {
      //     text: text,
      //     source: "received",
      //     timestamp: moment().unix()
      //   };

      //   console.log("from backend", message);
      // }
    });
  }

  sendMessage() {
    console.log("message", this.messageFormControl.value);
    const message = {
      text: this.messageFormControl.value.trim(),
      source: "origin",
      timestamp: moment().unix()
    };
    this.chat.push(message);
    this.chatService.emitMessage(message);
    this.messageFormControl.reset();
  }

}

import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ModalComponent } from '../modals/modal/modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  private _hubConnection: HubConnection | undefined;
  inGroup = false;
  connectionId = '';
  users: string[] = [];
  myTurn = false;
  serverId: string;
  gameStarted = false;

  activeUser = 0;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this._hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:5000/notify')
        .configureLogging(signalR.LogLevel.Information).build();
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log(err));

    this._hubConnection.on('GetAllConnectedUsers', (data: string) => {
      const tmpData: string[] = JSON.parse(data);
      this.users = tmpData;
    });

    this._hubConnection.on('MessageRecived', (data: string) => {
      if (this.connectionId === '') {
        this.connectionId = data;
      }
    });

    this._hubConnection.on('SetServerLocaly', (data: string) => {
      console.log(data);
      this.serverId = data;
      if (this.connectionId === this.serverId) {
        if (this.gameStarted === false) {
          console.log('server');
          this.turnGameServer();
          this.gameStarted = true;
        }
      }
    });

    this._hubConnection.on('NextUserServer', (data: number) => {
      console.log(data);
      this.activeUser = data;
      this.turnGameClient();
  });

  }

  turnGameServer() {
    setInterval(() => {
      this.gameServer();
    }, 10000);
  }

  turnGameClient() {
    this.dialog.closeAll();
    this.game();
  }

  gameServer() {
    if (this.users.length > this.activeUser + 1) {
      this.activeUser++;
    } else {
      this.activeUser = 0;
    }
    console.log(`active user is ` + this.activeUser);
    this._hubConnection.invoke('NextUser', this.activeUser).catch(err => console.log(err));

  }

  game() {
    if (this.users[this.activeUser] === this.connectionId) {
      this.myTurn = true;
      this.openDialog();
    } else {
      this.myTurn = false;
    }
  }

  openDialog() {
    const config = new MatDialogConfig();
    const dialogRef: MatDialogRef<ModalComponent> = this.dialog.open(ModalComponent, config);
    dialogRef.componentInstance.self = dialogRef;

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.accepted) {
        console.log('call websocket');
      }
    });
  }
}


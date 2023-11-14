import { Injectable } from '@angular/core';
import { InstanceData } from '../models/instance-data.model';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class InstanceDataService {
  instanceDataChanged = new Subject<InstanceData>();

  currentIntanceData: { [key: number]: InstanceData } = {};

  private _hubConnection: HubConnection;

  constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('data-hub')
      .build();
    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch((err: unknown) => console.log('Error while establishing connection\n' + err));

    this._hubConnection.on('ReceiveData', (data: InstanceData) => {
      this.instanceDataChanged.next(data);
      this.currentIntanceData[data.instanceId] = data;
    });
  }

  getInstanceData(instanceId: number) {
    if (!this.currentIntanceData.hasOwnProperty(instanceId))
      return null;
    return this.currentIntanceData[instanceId];
  }
}

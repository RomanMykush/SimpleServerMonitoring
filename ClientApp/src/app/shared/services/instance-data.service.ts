import { Injectable } from '@angular/core';
import { InstanceData } from '../models/instance-data.model';
import { Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class InstanceDataService {
  instanceData$ = new Subject<InstanceData>();

  currentIntanceData: { [instanceId: number]: InstanceData } = {};

  private _hubConnection: HubConnection;

  constructor() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('data-hub')
      .build();
    this._hubConnection
      .start()
      .then(() => console.log('Hub connection started!'))
      .catch((err: unknown) => console.log('Error while establishing connection\n' + err));

    this._hubConnection.on('ReceiveData', (data: InstanceData) => {
      this.currentIntanceData[data.instanceId] = data;
      this.instanceData$.next(data);
    });
  }

  getInstanceData(instanceId: number) {
    if (!this.currentIntanceData.hasOwnProperty(instanceId))
      return null;
    return this.currentIntanceData[instanceId];
  }
}

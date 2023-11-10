import { Injectable } from '@angular/core';
import { InstanceData } from '../models/instance-data.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstanceDataService {
  instanceDataChanged = new Subject<InstanceData>();

  currentIntanceData: { [key: number]: InstanceData } = {
    // Temp solution    TODO: Remove after http requests will be implemented
    1: new InstanceData(1, true, 42, 28, 1024, 105),
    2: new InstanceData(2, true, 24, 86, 1024, 835),
    3: new InstanceData(3, false, 12, 34, 1024, 942),
    4: new InstanceData(4, true, 74, 53, 1024, 635),
    5: new InstanceData(5, true, 53, 97, 1024, 835)
  };

  getInstanceData(instanceId: number) {
    if (!this.currentIntanceData.hasOwnProperty(instanceId))
      return null;
    return this.currentIntanceData[instanceId];
  }
}

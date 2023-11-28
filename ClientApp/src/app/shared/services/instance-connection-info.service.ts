import { Injectable } from '@angular/core';
import { InstanceConnectionInfo } from '../models/instance-connection-info.model';
import { Subject, Subscription, share } from 'rxjs';
import { InstanceService } from './instance.service';
import { HttpClient } from '@angular/common/http';
import { Instance } from '../models/instance.model';

@Injectable({
  providedIn: 'root'
})
export class InstanceConnectionInfoService {
  instConnInfo$ = new Subject<{ instanceId: number, instConnInfos: InstanceConnectionInfo[] }>();

  private instConnInfos: { [instanceId: number]: InstanceConnectionInfo[] } = {};

  subscription: Subscription;

  constructor(private instanceService: InstanceService,
    private http: HttpClient) {
    let initInstances = this.instanceService.getInstances();
    this.fetchConnectionInfos(initInstances);

    this.subscription = this.instanceService.instances$.subscribe(
      (instances: Instance[]) => {
        this.fetchConnectionInfos(instances);
      }
    );
  }

  getInstanceConnectionInfos(instanceId: number) {
    if (!this.instConnInfos.hasOwnProperty(instanceId))
      return null;
    return this.instConnInfos[instanceId];
  }

  deleteConnectionInfo(id: number) {
    let instanceId = -1;
    let index = -1;

    for (let currentId of Object.getOwnPropertyNames(this.instConnInfos).map(Number)) {
      index = this.instConnInfos[currentId].findIndex((element) => element.id == id);
      if (index > -1) {
        instanceId = currentId;
        break;
      }
    }
    if (instanceId == -1)
      return null;

    let observable = this.http.delete('api/InstanceConnections/' + id).pipe(share());
    observable.subscribe(() => {
      this.instConnInfos[instanceId].splice(index, 1);
      this.instConnInfo$.next({ instanceId: instanceId, instConnInfos: this.instConnInfos[instanceId].slice() });
    });
    return observable;
  }

  fetchConnectionInfos(instances: Instance[]) {
    instances.forEach(element => {
      this.http.get<InstanceConnectionInfo[]>('api/InstanceConnections/Instance/' + element.id).subscribe((instConnInfos) => {
        this.instConnInfos[element.id] = instConnInfos;
        this.instConnInfo$.next({ instanceId: element.id, instConnInfos: instConnInfos });
      });
    });
  }
}

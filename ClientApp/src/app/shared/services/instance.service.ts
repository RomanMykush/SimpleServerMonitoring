import { Injectable } from '@angular/core';
import { Instance } from '../models/instance.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  instancesChanged = new Subject<Instance[]>();

  private instances: Instance[] = [];

  constructor(private http: HttpClient) {
    this.fetchInstances().subscribe(players => {
      this.setInstances(players);
    });
  }

  getInstances() {
    return this.instances.slice();
  }

  setInstances(instances: Instance[]) {
    this.instances = instances;
    this.instancesChanged.next(this.instances.slice());
  }

  fetchInstances() {
    return this.http.get<Instance[]>('api/Instances');
  }
}

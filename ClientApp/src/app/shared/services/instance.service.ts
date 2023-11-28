import { Injectable } from '@angular/core';
import { Instance } from '../models/instance.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  instances$ = new Subject<Instance[]>();

  private instances: Instance[] = [];

  constructor(private http: HttpClient) {
    this.fetchInstances().subscribe(players => {
      this.setInstances(players);
    });
  }

  getInstances() {
    return this.instances.slice();
  }

  getInstance(id: number) {
    return this.instances.find((element) => element.id == id);
  }

  setInstances(instances: Instance[]) {
    this.instances = instances;
    this.instances$.next(this.instances.slice());
  }

  fetchInstances() {
    return this.http.get<Instance[]>('api/Instances');
  }
}

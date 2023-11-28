import { Injectable } from '@angular/core';
import { Instance } from '../models/instance.model';
import { Subject, share } from 'rxjs';
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

  deleteInstance(id: number) {
    let index = this.instances.findIndex((element) => element.id == id);
    if (index == -1)
      return null;

    let observable = this.http.delete('api/Instances/' + id).pipe(share());
    observable.subscribe(() => {
      this.instances.splice(index, 1);
      this.instances$.next(this.instances.slice());
    });
    return observable;
  }

  fetchInstances() {
    return this.http.get<Instance[]>('api/Instances').pipe(share());
  }
}

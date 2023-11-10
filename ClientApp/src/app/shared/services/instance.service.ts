import { Injectable } from '@angular/core';
import { Instance } from '../models/instance.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  instancesChanged = new Subject<Instance[]>();

  private instances: Instance[] = [
    // Temp solution    TODO: Remove after http requests will be implemented
    new Instance(1, "Test server 1", "Debian"),
    new Instance(2, "Test server 2", "CentOS"),
    new Instance(3, "Test server 3", "RedHatOS"),
    new Instance(4, "Test server 4", "OrangeOS"),
    new Instance(5, "Test server 5", "Arch")
  ];

  constructor() { }

  getInstances() {
    return this.instances.slice();
  }
}

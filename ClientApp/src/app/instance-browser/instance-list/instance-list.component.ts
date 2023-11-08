import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Instance } from 'src/app/shared/instance.model';
import { InstanceService } from 'src/app/shared/instance.service';

@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.scss']
})
export class InstanceListComponent {
  instances: Instance[];
  subscription: Subscription;

  constructor(private instanceService: InstanceService) { }

  ngOnInit() {
    // Temp solution    TODO: Remove after http requests will be implemented
    this.instances = this.instanceService.getInstances();
    // Subscribe to updates
    this.subscription = this.instanceService.instancesChanged.subscribe(
      (instances: Instance[]) => {
        this.instances = instances;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

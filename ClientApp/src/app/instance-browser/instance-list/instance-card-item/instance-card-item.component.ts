import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { InstanceData } from 'src/app/shared/models/instance-data.model';
import { Instance } from 'src/app/shared/models/instance.model';
import { InstanceDataService } from 'src/app/shared/services/instance-data.service';

@Component({
  selector: 'app-instance-card-item',
  templateUrl: './instance-card-item.component.html',
  styleUrls: ['./instance-card-item.component.scss']
})
export class InstanceCardItemComponent implements OnInit, OnDestroy {
  @Input() instance: Instance;
  instanceData: InstanceData;
  subscription: Subscription;

  constructor(private instanceDataService: InstanceDataService) { }

  ngOnInit() {
    // Temp solution    TODO: Remove after http requests will be implemented
    let initInstanceData = this.instanceDataService.getInstanceData(this.instance.id);
    if (initInstanceData != null)
      this.instanceData = initInstanceData;
    // Subscribe to updates
    this.subscription = this.instanceDataService.instanceDataChanged.subscribe(
      (instanceData: InstanceData) => {
        if (this.instance.id != instanceData.isntanceId)
          return;
        this.instanceData = instanceData;
      }
    );
  }

  isActive() {
    return this.instanceData != null && this.instanceData.isOnline;
  }

  getCpuLoadPercent() {
    if (!this.isActive())
      return '0%';
    return this.instanceData.cpuLoad + '%';
  }

  getRamLoadPercent() {
    if (!this.isActive())
      return '0%';
    return this.instanceData.ramLoad / this.instanceData.ramMax * 100 + '%';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

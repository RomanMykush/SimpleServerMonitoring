import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataState } from 'src/app/shared/data-state';
import { InstanceData } from 'src/app/shared/models/instance-data.model';
import { Instance } from 'src/app/shared/models/instance.model';
import { InstanceDataService } from 'src/app/shared/services/instance-data.service';
import { InstanceService } from 'src/app/shared/services/instance.service';

@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.scss']
})
export class InstanceDetailComponent {
  instanceId: number;
  instance: Instance;
  instanceData: InstanceData;

  instanceSubscription: Subscription;
  dataSubscription: Subscription;

  public dataStateEnum = DataState;
  dataState: DataState;
  dataFetchTimeout: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private instanceService: InstanceService,
    private instanceDataService: InstanceDataService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.dataState = DataState.Loading;
        this.instanceId = params['id'];
        this.updateInstance();

        if (this.dataSubscription != null)
          this.dataSubscription.unsubscribe();
        // Getting instance data
        let initInstanceData = this.instanceDataService.getInstanceData(this.instanceId);
        if (initInstanceData != null)
          this.instanceData = initInstanceData;
        // Subscribe to updates of instance data
        this.dataSubscription = this.instanceDataService.instanceDataChanged.subscribe(
          (data: InstanceData) => {
            if (this.instanceId != data.instanceId)
              return;
            this.instanceData = data;
          }
        );
      }
    );

    // Subscribe to updates of instance
    this.instanceSubscription = this.instanceService.instancesChanged.subscribe(
      (instances: Instance[]) => {
        this.updateInstance();
      }
    );
  }

  updateInstance() {
    let instanceResult = this.instanceService.getInstance(this.instanceId);
    if (!instanceResult) {
      if (this.dataState == DataState.Failed)
        return;
      if (this.dataFetchTimeout != null)
        return;
      this.dataFetchTimeout = window.setTimeout(() => {
        this.dataState = DataState.Failed;
        this.dataFetchTimeout = null;
      }, 5000)
      return;
    }

    if (this.dataFetchTimeout != null) {
      window.clearTimeout(this.dataFetchTimeout);
      this.dataFetchTimeout = null;
    }

    this.instance = instanceResult;
    this.dataState = DataState.Available;
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
    return this.instanceData.ramLoad / this.instanceData.maxRam * 100 + '%';
  }

  ngOnDestroy() {
    this.instanceSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}

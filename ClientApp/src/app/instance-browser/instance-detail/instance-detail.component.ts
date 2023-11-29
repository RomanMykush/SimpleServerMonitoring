import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataState } from 'src/app/shared/enums/data-state';
import { InstanceConnectionInfo } from 'src/app/shared/models/instance-connection-info.model';
import { InstanceData } from 'src/app/shared/models/instance-data.model';
import { Instance } from 'src/app/shared/models/instance.model';
import { InstanceConnectionInfoService } from 'src/app/shared/services/instance-connection-info.service';
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
  instConnInfos: InstanceConnectionInfo[];

  instanceSub: Subscription;
  dataSub: Subscription;
  connectionInfoSub: Subscription;

  public dataStateEnum = DataState;
  dataState: DataState;
  dataFetchTimeout: number | null = null;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private instanceService: InstanceService,
    private instanceDataService: InstanceDataService,
    private instConnInfoService: InstanceConnectionInfoService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.dataState = DataState.Loading;
        this.instanceId = params['id'];
        this.updateInstance();

        // Unsubscribe from previous instance data and connection info
        if (this.dataSub != null)
          this.dataSub.unsubscribe();
        if (this.connectionInfoSub != null)
          this.connectionInfoSub.unsubscribe();

        // Getting instance data
        let initInstanceData = this.instanceDataService.getInstanceData(this.instanceId);
        if (initInstanceData != null)
          this.instanceData = initInstanceData;
        // Subscribe to updates of instance data
        this.dataSub = this.instanceDataService.instanceData$.subscribe(
          (data: InstanceData) => {
            if (this.instanceId != data.instanceId)
              return;
            this.instanceData = data;
          }
        );

        // Getting instance connetion info
        let initInstConnInfo = this.instConnInfoService.getInstanceConnectionInfos(this.instanceId);
        if (initInstConnInfo != null) {
          this.instConnInfos = initInstConnInfo;
        }
        // Subscribe to updates of instance connection info
        this.connectionInfoSub = this.instConnInfoService.instConnInfo$.subscribe(
          (connInfo: { instanceId: number, instConnInfos: InstanceConnectionInfo[] }) => {
            if (connInfo.instanceId != this.instanceId)
              return;
            this.instConnInfos = connInfo.instConnInfos;
          }
        );
      }
    );

    // Subscribe to updates of instance
    this.instanceSub = this.instanceService.instances$.subscribe(
      (instances: Instance[]) => {
        this.dataState = DataState.Loading;
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
      }, 5000);
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

  onDelete() {
    let observable = this.instanceService.deleteInstance(this.instance.id);
    this.dataState = DataState.Loading;
    if (!observable)
      return;

    observable.subscribe(() => { this.router.navigate(['']); });
  }

  ngOnDestroy() {
    this.instanceSub.unsubscribe();
    this.dataSub.unsubscribe();
    this.connectionInfoSub.unsubscribe();
  }
}

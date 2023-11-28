import { Component, Input } from '@angular/core';
import { InstanceConnectionInfo } from 'src/app/shared/models/instance-connection-info.model';
import { InstanceConnectionInfoService } from 'src/app/shared/services/instance-connection-info.service';

@Component({
  selector: 'app-connection-detail',
  templateUrl: './connection-detail.component.html',
  styleUrls: ['./connection-detail.component.scss']
})
export class ConnectionDetailComponent {
  @Input() connectionInfo: InstanceConnectionInfo;
  fullConnectionInfo: InstanceConnectionInfo | null;

  constructor(private instConnInfoService: InstanceConnectionInfoService) { }

  onShowSecret() {
    this.instConnInfoService.fetchFullConnectionInfo(this.connectionInfo.id)?.subscribe((res) => {
      this.fullConnectionInfo = res;
    });
  }

  onHideSecret() {
    this.fullConnectionInfo = null;
  }

  onDelete() {
    this.instConnInfoService.deleteConnectionInfo(this.connectionInfo.id);
  }
}

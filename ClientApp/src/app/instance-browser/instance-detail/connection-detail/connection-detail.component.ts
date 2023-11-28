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

  constructor(private instConnInfoService: InstanceConnectionInfoService) { }

  onShowSecret() {
    // TODO: Implement secret showing
  }

  onDelete() {
    this.instConnInfoService.deleteConnectionInfo(this.connectionInfo.id);
  }
}

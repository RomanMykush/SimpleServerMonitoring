import { Component, Input } from '@angular/core';
import { InstanceConnectionInfo } from 'src/app/shared/models/instance-connection-info.model';

@Component({
  selector: 'app-connection-detail',
  templateUrl: './connection-detail.component.html',
  styleUrls: ['./connection-detail.component.scss']
})
export class ConnectionDetailComponent {
  @Input() connectionInfo: InstanceConnectionInfo;

  onShowSecret() {
    // TODO: Implement secret showing
  }

  onDelete() {
    // TODO: Implement deleting
  }
}

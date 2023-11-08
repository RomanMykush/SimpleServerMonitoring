import { Component, Input } from '@angular/core';
import { Instance } from 'src/app/shared/instance.model';

@Component({
  selector: 'app-instance-card-item',
  templateUrl: './instance-card-item.component.html',
  styleUrls: ['./instance-card-item.component.scss']
})
export class InstanceCardItemComponent {
  @Input() instance : Instance;

  // Temp placeholder   TODO: Implement current instance data fetching
  getCpuLoadPercent() {
    return '40%';
  }
  // Temp placeholder   TODO: Implement current instance data fetching
  getRamLoadPercent() {
    return '60%';
  }
}

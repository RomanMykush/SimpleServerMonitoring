import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DummyComponent } from '../shared/components/dummy/dummy.component';

@Component({
  selector: 'app-instance-browser',
  templateUrl: './instance-browser.component.html',
  styleUrls: ['./instance-browser.component.scss']
})
export class InstanceBrowserComponent {
  constructor(private route: ActivatedRoute) { }

  checkForEmptyRoute() {
    return this.route.firstChild?.component == DummyComponent;
  }
}

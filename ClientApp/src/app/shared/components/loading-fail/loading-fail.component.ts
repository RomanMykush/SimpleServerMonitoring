import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-fail',
  templateUrl: './loading-fail.component.html'
})
export class LoadingFailComponent {
  @Input() message = 'Failed to load content';
}

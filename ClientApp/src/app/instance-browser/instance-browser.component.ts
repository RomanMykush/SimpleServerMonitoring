import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DummyComponent } from '../shared/components/dummy/dummy.component';

@Component({
  selector: 'app-instance-browser',
  templateUrl: './instance-browser.component.html',
  styleUrls: ['./instance-browser.component.scss']
})
export class InstanceBrowserComponent implements AfterViewInit {
  smallScreenWidth = 960;
  isSmallScreen = false;
  sidenavMode: 'over' | 'push' | 'side' = 'side';
  
  constructor(private route: ActivatedRoute,
    private componentElement: ElementRef,
    private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.checkScreenSpace();
    this.cdr.detectChanges();
  }

  checkForEmptyRoute() {
    return this.route.firstChild?.component == DummyComponent;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.checkScreenSpace();
  }

  checkScreenSpace() {
    let width = this.componentElement.nativeElement.offsetWidth;
    this.isSmallScreen = width <= this.smallScreenWidth;
    if (this.isSmallScreen) {
      this.sidenavMode = 'over';
      return;
    }
    this.sidenavMode = 'side';
  }
}

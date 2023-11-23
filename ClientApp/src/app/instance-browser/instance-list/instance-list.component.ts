import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Instance } from 'src/app/shared/models/instance.model';
import { InstanceService } from 'src/app/shared/services/instance.service';
import { CssUnitHelper } from 'src/app/shared/utils';

@Component({
  selector: 'app-instance-list',
  templateUrl: './instance-list.component.html',
  styleUrls: ['./instance-list.component.scss']
})
export class InstanceListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('itemListRow', { static: false }) rowElement: ElementRef;
  componentResize: ResizeObserver;

  minColumnWidth = 460;
  maxColumnWidth = 560;

  columnNumber = 2;
  rowMargin = 0;
  rowGutter = 0;

  instances: Instance[];
  subscription: Subscription;

  constructor(private instanceService: InstanceService,
    private componentElement: ElementRef) { }

  ngOnInit() {
    // Subscribe to updates
    this.subscription = this.instanceService.instancesChanged.subscribe(
      (instances: Instance[]) => {
        this.instances = instances;
      }
    );
  }

  ngAfterViewInit() {
    let rowGutter = CssUnitHelper.convertCssUnit(getComputedStyle(this.rowElement.nativeElement).getPropertyValue('--bs-gutter-y'));
    if (rowGutter != null)
      this.rowGutter = rowGutter;
    // Detect element width change
    this.componentResize = new ResizeObserver(entries => {
      this.recalcDimensions();
    });
    this.componentResize.observe(this.componentElement.nativeElement);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.recalcDimensions();
  }

  recalcDimensions() {
    this.recalcNumOfColumns();
    this.recalcRowMargin();
  }

  recalcNumOfColumns() {
    let contWidth = this.componentElement.nativeElement.offsetWidth;
    if (this.minColumnWidth > contWidth) {
      this.columnNumber = 1;
      return;
    }
    this.columnNumber = Math.floor(contWidth / this.minColumnWidth);
  }

  recalcRowMargin() {
    let newRowMargin = this.componentElement.nativeElement.offsetWidth
      - this.columnNumber * this.maxColumnWidth
      - this.rowGutter * (this.columnNumber + 1);

    if (newRowMargin < 0) {
      this.rowMargin = 0;
      return;
    }
    this.rowMargin = newRowMargin;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.componentResize.unobserve(this.componentElement.nativeElement);
  }
}
